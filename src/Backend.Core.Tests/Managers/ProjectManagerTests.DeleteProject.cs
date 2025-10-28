using Backend.Core.Manager;
using Backend.Core.Tests.Mocks;
using Backend.Models;
using Shouldly;

namespace Backend.Core.Tests;

public partial class ProjectManagerTests
{
    [Fact]
    public void DeleteProject_must_be_successful()
    {
        //arrange
        var userRepo = new TestUserRepository();
        userRepo.AddUser(new User
        {
            Id = 123,
            PasswordHash = AccountManagerTests.HashPassword("pass"),
            Username = "user1"
        });
        var data = new TestDataSource();
        var projectRepo = new TestProjectRepository(data);
        data.Projects = new List<Project>
        {
            new() { Id = 1, Name = "Project A", UserId = 123 },
            new() { Id = 2, Name = "Project B", UserId = 456 },
            new() { Id = 3, Name = "Project C", UserId = 123 },
            new() { Id = 4, Name = "Project D", UserId = 111 },
            new() { Id = 5, Name = "Project E", UserId = 23 }
        };
        var sut = new ProjectManager(projectRepo, userRepo);
        
        //act
        sut.DeleteProject(3, 123);
        
        //assert
        data.Projects.ShouldBe(new List<Project>
        {
            new() { Id = 1, Name = "Project A", UserId = 123 },
            new() { Id = 2, Name = "Project B", UserId = 456 },
            new() { Id = 4, Name = "Project D", UserId = 111 },
            new() { Id = 5, Name = "Project E", UserId = 23 }
        });
    }
    
    [Fact]
    public void DeleteProject_must_throw_unauthorized_exception_if_user_does_not_own_project()
    {
        //arrange
        var userRepo = new TestUserRepository();
        userRepo.AddUser(new User
        {
            Id = 123,
            PasswordHash = AccountManagerTests.HashPassword("pass"),
            Username = "user1"
        });
        var data = new TestDataSource();
        var projectRepo = new TestProjectRepository(data);
        data.Projects = new List<Project>
        {
            new() { Id = 1, Name = "Project A", UserId = 123 },
            new() { Id = 2, Name = "Project B", UserId = 456 },
            new() { Id = 3, Name = "Project C", UserId = 123 }
        };
        var sut = new ProjectManager(projectRepo, userRepo);
        
        //act and assert
        var exception = Assert.Throws<UnauthorizedAccessException>(
            () =>sut.DeleteProject(3, 245));
        exception.ShouldNotBeNull();
        exception.Message.ShouldBe("User does not own this project");
        
        data.Projects.ShouldBe(new List<Project>
        {
            new() { Id = 1, Name = "Project A", UserId = 123 },
            new() { Id = 2, Name = "Project B", UserId = 456 },
            new() { Id = 3, Name = "Project C", UserId = 123 }
        });
    }
    
    
    [Fact]
    public void DeleteProject_must_throw_project_not_found_exception_if_project_is_nonexistent()
    {
        //arrange
        var userRepo = new TestUserRepository();
        userRepo.AddUser(new User
        {
            Id = 123,
            PasswordHash = AccountManagerTests.HashPassword("pass"),
            Username = "user1"
        });
        var data = new TestDataSource();
        var projectRepo = new TestProjectRepository(data);
        data.Projects = new List<Project>
        {
            new() { Id = 1, Name = "Project A", UserId = 123 },
            new() { Id = 2, Name = "Project B", UserId = 456 }
        };
        var sut = new ProjectManager(projectRepo, userRepo);
        
        //act and assert
        var exception = Assert.Throws<ProjectNotFoundException>(
            () =>sut.DeleteProject(3, 245));
        exception.ShouldNotBeNull();
        
        data.Projects.ShouldBe(new List<Project>
        {
            new() { Id = 1, Name = "Project A", UserId = 123 },
            new() { Id = 2, Name = "Project B", UserId = 456 }
        });
    }
}