using Backend.Models;
using Backend.WebApi.Repository;
using Shouldly;

namespace Backend.WebApi.Tests.Repository;

public partial class ProjectRepositoryTests
{
    [Fact]
    public void TestClear()
    {
        //arrange
        var dbContext = Utils.CreateTestDB();
        var user1Project = new Project()
        {
            Id = 1,
            UserId = 1,
            Name = "Project 1"
        };
        dbContext.Projects.Add(user1Project);
        dbContext.Projects.Add(new()
        {
            Id = 2,
            UserId = 2,
            Name = "Project 2"
        });
        dbContext.SaveChanges();
        var sut = new ProjectRepository(dbContext);
        
        //act
        sut.Clear(2);
        
        //assert
        dbContext.Projects.ShouldBe([
            new Project()
            {
                Id = 1,
                UserId = 1,
                Name = "Project 1"
            }
        ]);
    }
}