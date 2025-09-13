using Backend.Models;
using Backend.WebApi.Repository;
using Microsoft.EntityFrameworkCore;
using Shouldly;

namespace Backend.WebApi.Tests.Repository;

public partial class ItemRepositoryTests
{
    [Fact]
    public void TestCreateItem()
    {
        //arrange
        var dbContext = Utils.CreateTestDB();
        var sut = new ItemRepository(dbContext);
        
        //act
        var itemId = sut.CreateItem(new()
        {
            Id = 0,
            Description = "Test task",
            Done = true,
            Later = false,
        });
        
        //assert
        dbContext.Items.Count().ShouldBe(1);
        dbContext.Items.First().ShouldBe(new()
        {
            Id = itemId,
            Description = "Test task",
            Done = true,
            Later = false,
        });
    }
}