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
        var projectRepo = new TestProjectRepository();
        projectRepo.Projects = new List<Project>
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
        projectRepo.Projects.ShouldBe(new List<Project>
        {
            new() { Id = 1, Name = "Project A", UserId = 123 },
            new() { Id = 2, Name = "Project B", UserId = 456 },
            new() { Id = 4, Name = "Project D", UserId = 111 },
            new() { Id = 5, Name = "Project E", UserId = 23 }
        });
    } 
}