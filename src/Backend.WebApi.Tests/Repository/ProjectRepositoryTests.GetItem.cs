using Backend.WebApi.Repository;
using Shouldly;

namespace Backend.WebApi.Tests.Repository;

public partial class ProjectRepositoryTests
{
    [Fact]
    public void TestGetProjectsByUser()
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
        var projects = sut.GetProjects(2, null, null);
        
        projects.ShouldBe([
            new() { Id = 3, Name = "Project C", Later = true, UserId = 2 },
            new() { Id = 4, Name = "Project D", Later = false, UserId = 2 }
        ]);
    }
}