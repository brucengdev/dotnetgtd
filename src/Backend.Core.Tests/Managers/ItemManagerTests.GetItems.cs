using Backend.Core.Manager;
using Backend.Core.Repository;
using Backend.Core.Tests.Mocks;
using Backend.Models;
using Moq;
using Shouldly;

namespace Backend.Core.Tests;

public partial class ItemManagerTests
{
    [Fact]
    public void GetItems_is_successful()
    {
        //arrange
        var repo = new TestItemRepository(Data);
        Data.Items.Add(new Item
        {
            Id = 1,
            Description = "Task 1",
            UserId = 123,
            Done = true,
            Later = false
        });
        Data.Items.Add(new Item
        {
            Id = 2,
            Description = "Task 2",
            UserId = 234,
            Done = false,
            Later = true
        });
        Data.Items.Add(new Item
        {
            Id = 3,
            Description = "Task 3",
            UserId = 123,
            Done = false,
            Later = true
        });
        var itemTagMappingRepo = new TestItemTagMappingRepo(Data);
        Data.ItemTagMappings =
        [
            new() { Id = 1, ItemId = 1, TagId = 1 },
            new() { Id = 2, ItemId = 1, TagId = 2 },
            new() { Id = 3, ItemId = 2, TagId = 2 },
        ];
        var sut = new ItemManager(repo, new Mock<IUserRepository>().Object, itemTagMappingRepo);
        var expectedUserId = 123;

        //act
        var items = sut.GetItems(expectedUserId);

        //assert
        items.ShouldBe(new List<ItemServiceModel>()
        {
            new () {
                Id = 1,
                Description = "Task 1",
                UserId = 123,
                TagIds = [ 1, 2 ],
                Done = true,
                Later = false
            },
            new()
            {
                Id = 3,
                Description = "Task 3",
                UserId = 123,
                TagIds = [],
                Done = false,
                Later = true
            }
        });
    }
}