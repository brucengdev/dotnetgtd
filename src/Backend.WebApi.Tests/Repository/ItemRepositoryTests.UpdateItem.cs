using Backend.Models;
using Backend.WebApi.Repository;
using Microsoft.EntityFrameworkCore;
using Shouldly;

namespace Backend.WebApi.Tests.Repository;

public partial class ItemRepositoryTests
{
    [Fact]
    public void TestUpdateItem()
    {
        //arrange
        var dbContext = Utils.CreateTestDB();
        dbContext.Items.Add(new()
        {
            Id = 2,
            UserId = 1,
            Description = "Test task",
            Done = false,
            Later = true,
            ProjectId = 2
        });
        dbContext.SaveChanges();
        var sut = new ItemRepository(dbContext);
        
        //act
        var newItem = new Item()
        {
            Id = 2,
            UserId = 1,
            Description = "Updated test task",
            Done = true,
            Later = false,
            ProjectId = 3
        };
        sut.UpdateItem(newItem);
        
        //assert
        dbContext.Items.Count().ShouldBe(1);
        dbContext.Items.First().ShouldBe(newItem);
    }
}