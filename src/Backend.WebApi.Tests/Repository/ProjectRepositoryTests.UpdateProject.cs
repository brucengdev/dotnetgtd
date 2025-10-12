using Backend.Models;
using Backend.WebApi.Repository;
using Shouldly;

namespace Backend.WebApi.Tests.Repository;

public partial class ProjectRepositoryTests
{
    [Fact]
    public void TestUpdateProject()
    {
        //arrange
        var dbContext = Utils.CreateTestDB();
        CreateTestData(dbContext);
        int numberOfProjects = dbContext.Projects.Count();
        var sut = new ProjectRepository(dbContext);
        
        //act
        Project inputProject = new()
        {
            Id = 2,
            Name = "Project B Updated",
            Done = false,
            Later = false,
            UserId = 1
        };
        sut.UpdateProject(inputProject);

        //assert
        dbContext.Projects.Count().ShouldBe(numberOfProjects);
        var savedProject = dbContext.Projects.First(p => p.Id == 2);
        savedProject.ShouldBe(inputProject);
    }
}