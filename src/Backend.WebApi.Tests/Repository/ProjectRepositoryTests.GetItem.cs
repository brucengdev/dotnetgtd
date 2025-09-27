using Backend.WebApi.Repository;
using Shouldly;

namespace Backend.WebApi.Tests.Repository;

public class ProjectRepositoryTests
{
    [Theory]
    [InlineData(2, "Project C,Project D")]
    [InlineData(1, "Project A,Project B")]
    [InlineData(3, "")]
    public void TestGetProjectsByUser(int userId, string expectedProjectNames)
    {
        //arrange
        var dbContext = Utils.CreateTestDB();
        dbContext.Projects.AddRange(
        [
            new() { Id = 1, Name = "Project A", Later = false, UserId = 1 },
            new() { Id = 2, Name = "Project B", Later = true, UserId = 1 },
            new() { Id = 3, Name = "Project C", Later = true, UserId = 2 },
            new() { Id = 4, Name = "Project D", Later = false, UserId = 2 }
        ]);
        dbContext.SaveChanges();
        var sut = new ProjectRepository(dbContext);
        
        //act
        var projects = sut.GetProjects(userId, null, null);

        var projectNames = string.Join(',', projects.Select(p => p.Name));
        projectNames.ShouldBe(expectedProjectNames);
    }
    
    [Theory]
    [InlineData(null, "Project A,Project B")]
    [InlineData("", "")]
    [InlineData("true", "Project B")]
    [InlineData("false", "Project A")]
    public void TestGetProjectsByLaterStatus(string? laterFilter, string expectedProjectNames)
    {
        //arrange
        var dbContext = Utils.CreateTestDB();
        dbContext.Projects.AddRange(
        [
            new() { Id = 1, Name = "Project A", Later = false, UserId = 1 },
            new() { Id = 2, Name = "Project B", Later = true, UserId = 1 }
        ]);
        dbContext.SaveChanges();
        var sut = new ProjectRepository(dbContext);
        IEnumerable<bool>? laterStatuses = null;
        if (laterFilter == "")
        {
            laterStatuses = [];
        } else if (laterFilter != null)
        {
            laterStatuses = laterFilter.Split(',').Select(v => v == "true");
        }
        
        //act
        var projects = sut.GetProjects(1, null, laterStatuses);

        var projectNames = string.Join(',', projects.Select(p => p.Name));
        projectNames.ShouldBe(expectedProjectNames);
    }
}