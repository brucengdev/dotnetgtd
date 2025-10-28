using Backend.Models;
using Backend.WebApi.Repository;
using Shouldly;

namespace Backend.WebApi.Tests.Repository;

public partial class ItemRepositoryTests
{
    [Fact]
    public void TestClear()
    {
        //arrange
        var dbContext = Utils.CreateTestDB();
        var user1Item = new Item()
        {
            Id = 1,
            UserId = 1,
            Description = "Test task",
            Done = false,
            Later = true,
            ProjectId = 2
        };
        dbContext.Items.Add(user1Item);
        dbContext.Items.Add(new()
        {
            Id = 2,
            UserId = 2,
            Description = "Test task 2",
            Done = false,
            Later = true,
            ProjectId = 2
        });
        dbContext.ItemTagMappings.Add(new()
        {
            Id = 1, ItemId = 1, TagId = 1
        });
        dbContext.ItemTagMappings.Add(new()
        {
            Id = 2, ItemId = 3, TagId = 1
        });
        dbContext.SaveChanges();
        var sut = new ItemRepository(dbContext);
        
        //act
        sut.Clear(2);
        
        //assert
        dbContext.Items.Count().ShouldBe(1);
        dbContext.Items.First().ShouldBe(user1Item);
        
        dbContext.ItemTagMappings.Count().ShouldBe(1);
        dbContext.ItemTagMappings.First().ShouldBe(new()
        {
            Id = 2, ItemId = 3, TagId = 1
        });
    }
}