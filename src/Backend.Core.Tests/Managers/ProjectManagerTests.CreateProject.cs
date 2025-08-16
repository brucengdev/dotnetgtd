using Backend.Core.Manager;
using Backend.Core.Tests.Mocks;
using Backend.Models;
using Shouldly;

namespace Backend.Core.Tests;

public partial class ProjectManagerTests
{
    [Fact]
    public void Create_project_must_be_successful()
    {
        //arrange
        var userRepo = new TestUserRepository();
        userRepo.AddUser(new User
        {
            Id = 123,
            Password = "pass",
            Username = "user1"
        });
        var projectRepo = new TestProjectRepository();
        var sut = new ProjectManager(projectRepo, userRepo);
        
        //act
        var projectId = sut.CreateProject(new Project
        {
            Description = "Project Name",
            Id = 0,
            UserId = 123
        });
        
        //assert
        projectRepo.Projects.Count.ShouldBe(1);
        var savedItem = projectRepo.Projects[0];
        savedItem.ShouldBe(new Project
        {
            Description = "Project Name",
            Id = projectId,
            UserId = 123
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
        Assert.Throws<UserNotFoundException>(() => sut.CreateProject(new Project
        {
            Description = "Project Name",
            Id = 0,
            UserId = 123
        }));
        
        //assert
        projectRepo.Projects.Count.ShouldBe(0);
    } 
}