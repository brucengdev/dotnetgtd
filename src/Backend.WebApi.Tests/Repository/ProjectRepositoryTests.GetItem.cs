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
            new() { Id = 1, Name = "Project A", Done = false, Later = false, UserId = 1 },
            new() { Id = 2, Name = "Project B", Done = true,  Later = true,  UserId = 1 },
            
            new() { Id = 3, Name = "Project C", Done = false, Later = false,  UserId = 2 },
            new() { Id = 4, Name = "Project D", Done = false, Later = true, UserId = 2 },
            new() { Id = 5, Name = "Project E", Done = true,  Later = false,  UserId = 2 },
            new() { Id = 6, Name = "Project F", Done = true,  Later = true, UserId = 2 }
        ]);
        dbContext.SaveChanges();
    }
    
    [Theory]
    //filter by userID
    [InlineData(2, null, null, "Project C,Project D,Project E,Project F")]
    [InlineData(1, null, null, "Project A,Project B")]
    [InlineData(3, null, null, "")]
    //filter by completion statuses
    [InlineData(1, null, null, "Project A,Project B")]
    [InlineData(1, "", null, "")]
    [InlineData(1, "true", null, "Project B")]
    [InlineData(1, "false", null, "Project A")]
    [InlineData(1, "true,false", null, "Project A,Project B")]
    //filter by later statuses
    [InlineData(1, null, null, "Project A,Project B")]
    [InlineData(1, null, "", "")]
    [InlineData(1, null, "true", "Project B")]
    [InlineData(1, null, "false", "Project A")]
    [InlineData(1, null, "true,false", "Project A,Project B")]
    //mixed filters
    [InlineData(2, "false", "false", "Project C")]
    [InlineData(2, "false", "true", "Project D")]
    [InlineData(2, "true", "false", "Project E")]
    [InlineData(2, "true", "true", "Project F")]
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