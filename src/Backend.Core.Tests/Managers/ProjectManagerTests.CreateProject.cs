using Backend.Core.Manager;
using Backend.Core.Tests.Mocks;
using Backend.Models;

namespace Backend.Core.Tests;

public partial class ProjectManagerTests
{
    [Fact]
    public void Create_project_must_be_successful()
    {
        //arrange
        var projectRepo = new TestProjectRepository();
        var sut = new ProjectManager();
        
        //act
        var projectId = sut.CreateProject(new Project
        {
            Description = "Project Name",
            Id = 0,
            UserId = 123
        });
        
        //assert
        
    } 
}