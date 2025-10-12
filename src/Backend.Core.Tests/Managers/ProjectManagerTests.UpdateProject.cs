using Backend.Core.Manager;
using Backend.Core.Tests.Mocks;
using Backend.Models;
using Shouldly;

namespace Backend.Core.Tests;

public partial class ProjectManagerTests
{
    [Theory]
    [InlineData("Project A", true)]
    [InlineData("Project B", false)]
    public void Update_project_must_be_successful(string projectName, bool later)
    {
        //arrange
        var userRepo = new TestUserRepository();
        userRepo.AddUser(new User
        {
            Id = 123,
            Username = "user1",
            PasswordHash = AccountManagerTests.HashPassword("pass")
        });
        var projectRepo = new TestProjectRepository();
        projectRepo.Projects.Add(new()
        {
            Id = 2,
            Name = "Project X",
            UserId = 123,
            Later = false,
            Done = false
        });
        var sut = new ProjectManager(projectRepo, userRepo);
        
        //act
        sut.UpdateProject(new Project
        {
            Name = projectName,
            Id = 2,
            UserId = 123,
            Later = later
        }, 123);
        
        //assert
        projectRepo.Projects.Count.ShouldBe(1);
        var savedItem = projectRepo.Projects[0];
        savedItem.ShouldBe(new Project
        {
            Name = projectName,
            Id = 2,
            UserId = 123,
            Later = later
        });
    } 
    
    [Fact]
    public void Update_project_must_return_user_not_found_error_with_invalid_user()
    {
        //arrange
        var userRepo = new TestUserRepository();
        var projectRepo = new TestProjectRepository();
        projectRepo.Projects.Add(new()
        {
            Id = 2,
            Name = "Project X",
            UserId = 123
        });
        var sut = new ProjectManager(projectRepo, userRepo);
        
        //act and assert
        Assert.Throws<UserNotFoundException>(() => sut.UpdateProject(new Project
        {
            Id = 2,
            Name = "Updated project",
            UserId = 123
        }, 234));
        
        //assert
        projectRepo.Projects.Count.ShouldBe(1);
    }
    
    [Fact]
    public void Update_project_must_throw_unauthorized_if_user_does_not_own_project()
    {
        //arrange
        var userRepo = new TestUserRepository();
        userRepo.AddUser(new()
        {
            Id = 234,
            Username = "user1",
            PasswordHash = AccountManagerTests.HashPassword("pass")
        });
        var projectRepo = new TestProjectRepository();
        projectRepo.Projects.Add(new()
        {
            Id = 2,
            Name = "Project X",
            UserId = 123
        });
        var sut = new ProjectManager(projectRepo, userRepo);
        
        //act and assert
        Assert.Throws<UnauthorizedAccessException>(() => sut.UpdateProject(new Project
        {
            Name = "Project Name",
            Id = 2,
            UserId = 234
        }, 234));
        
        //assert
        projectRepo.Projects.Count.ShouldBe(1);
        projectRepo.Projects[0].ShouldBe(new()
        {
            Id = 2,
            Name = "Project X",
            UserId = 123
        });
    } 
}