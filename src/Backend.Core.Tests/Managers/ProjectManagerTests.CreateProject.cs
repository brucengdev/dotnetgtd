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
    public void Create_project_must_be_successful(string projectName, bool later)
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
        var sut = new ProjectManager(projectRepo, userRepo);
        
        //act
        var projectId = sut.CreateProject(new ProjectServiceModel()
        {
            Name = projectName,
            Id = 0,
            Later = later
        }, 123);
        
        //assert
        projectRepo.Projects.Count.ShouldBe(1);
        var savedItem = projectRepo.Projects[0];
        savedItem.ShouldBe(new Project
        {
            Name = projectName,
            Id = projectId,
            UserId = 123,
            Later = later
        });
    } 
    
    [Fact]
    public void Create_project_must_return_user_not_found_error_with_invalid_user()
    {
        //arrange
        var userRepo = new TestUserRepository();
        var projectRepo = new TestProjectRepository();
        var sut = new ProjectManager(projectRepo, userRepo);
        
        //act and assert
        Assert.Throws<UserNotFoundException>(() => sut.CreateProject(new ProjectServiceModel()
        {
            Name = "Project Name",
            Id = 0
        }, 123));
        
        //assert
        projectRepo.Projects.Count.ShouldBe(0);
    } 
}