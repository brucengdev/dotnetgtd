using Backend.Models;
using Backend.WebApi.Repository;
using Microsoft.EntityFrameworkCore;
using Shouldly;

namespace Backend.WebApi.Tests.Repository;

public partial class ItemRepositoryTests
{
    [Fact]
    public void GetItems_must_return_values()
    {
        //arrange
        var dbContextOptionsBuilder = new DbContextOptionsBuilder<GTDContext>();
        dbContextOptionsBuilder.UseInMemoryDatabase("TestGetItems");
        var dbContext = new GTDContext(dbContextOptionsBuilder.Options);
        var sut = new ItemRepository(dbContext);
        dbContext.Items.Add(new()
        {
            Id = 0,
            Description = "Task A",
            Done = true,
            UserId = 1
        });
        dbContext.SaveChanges();
        var itemId = dbContext.Items.First().Id;

        //act
        var items = sut.GetItems(1, [], false);
        
        //assert
        items.Count().ShouldBe(1);
        var item = items.First();
        item.ShouldBe(new()
        {
            Id = itemId,
            Description = "Task A",
            Done = true,
            UserId = 1
        });
    }
}