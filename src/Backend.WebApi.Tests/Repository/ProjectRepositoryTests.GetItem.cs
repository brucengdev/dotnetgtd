using Backend.Models;
using Backend.WebApi.Repository;
using Shouldly;

namespace Backend.WebApi.Tests.Repository;

public class ProjectRepositoryTests
{
    private static void CreateTestData(GTDContext dbContext)
    {
        dbContext.Projects.AddRange(
        [
            new() { Id = 1, Name = "Project A", Later = false, Done = false, UserId = 1 },
            new() { Id = 2, Name = "Project B", Later = true, Done = true, UserId = 1 },
            new() { Id = 3, Name = "Project C", Later = true, UserId = 2 },
            new() { Id = 4, Name = "Project D", Later = false, UserId = 2 }
        ]);
        dbContext.SaveChanges();
    }
    
    [Theory]
    [InlineData(2, null, null, "Project C,Project D")]
    [InlineData(1, null, null, "Project A,Project B")]
    [InlineData(3, null, null, "")]
    
    [InlineData(1, null, null, "Project A,Project B")]
    [InlineData(1, "", null, "")]
    [InlineData(1, "true", null, "Project B")]
    [InlineData(1, "false", null, "Project A")]
    
    [InlineData(1, null, null, "Project A,Project B")]
    [InlineData(1, null, "", "")]
    [InlineData(1, null, "true", "Project B")]
    [InlineData(1, null, "false", "Project A")]
    public void TestGetProjects(
        int userId,
        string? completionFilter, 
        string? laterFilter,
        string expectedProjectNames)
    {
        //arrange
        var dbContext = Utils.CreateTestDB();
        CreateTestData(dbContext);
        var sut = new ProjectRepository(dbContext);
        IEnumerable<bool>? completionStatuses = null;
        if (completionFilter == "")
        {
            completionStatuses = [];
        } else if (completionFilter != null)
        {
            completionStatuses = completionFilter.Split(',').Select(v => v == "true");
        }
        IEnumerable<bool>? laterStatuses = null;
        if (laterFilter == "")
        {
            laterStatuses = [];
        } else if (laterFilter != null)
        {
            laterStatuses = laterFilter.Split(',').Select(v => v == "true");
        }
        
        //act
        var projects = sut.GetProjects(userId, completionStatuses, laterStatuses);

        var projectNames = string.Join(',', projects.Select(p => p.Name));
        projectNames.ShouldBe(expectedProjectNames);
    }
}