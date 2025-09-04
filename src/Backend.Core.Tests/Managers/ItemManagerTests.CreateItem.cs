using Backend.Core.Manager;
using Backend.Core.Tests.Mocks;
using Backend.Models;
using Shouldly;

namespace Backend.Core.Tests;

public partial class ItemManagerTests
{
    [Theory]
    [InlineData("task a", false, false)]
    [InlineData("task b", false, true)]
    [InlineData("task c", true, false)]
    [InlineData("task d", true, true)]
    public void Creating_item_is_successful(string desc, bool done, bool later)
    {
        //arrange
        var itemRepo = new TestItemRepository(Data);
        Data.Items = new List<Item>()
        {
            new Item
            {
                Id = 1,
                Description = "Task 1",
                UserId = 123,
                ProjectId = null
            },
            new Item
            {
                Id = 2,
                Description = "Task 2",
                UserId = 234,
                ProjectId = 1
            }
        };
        var userRepo = new TestUserRepository();
        userRepo.AddUser(new()
        {
            Id = 123,
            Username = "testuser"
        });

        var tagRepo = new TestTagRepository();
        tagRepo.Tags = new List<Tag>()
        {
            new() { Id = 1, UserId = 123, Name = "Tag1" },
            new() { Id = 2, UserId = 123, Name = "Tag2" },
        };
        var itemTagMappingRepo = new TestItemTagMappingRepo(Data);
        var sut = new ItemManager(itemRepo, userRepo, itemTagMappingRepo);
        var input = new ItemServiceModel
        {
            Description = desc,
            ProjectId = 2,
            TagIds = [1, 2],
            Done = done,
            Later = later
        };

        //act
        var itemId = sut.CreateItem(input, 123);

        //assert
        var expectedItemId = 3;
        itemId.ShouldBe(expectedItemId);
        Data.Items.Count.ShouldBe(3);
        var savedItem = Data.Items[Data.Items.Count - 1];
        savedItem.ShouldBe(new Item
        {
            Id = expectedItemId,
            Description = desc,
            UserId = 123,
            ProjectId = 2,
            Done = done,
            Later = later
        });

        Data.ItemTagMappings.Where(m => m.ItemId == expectedItemId)
            .ShouldBe(new List<ItemTagMapping>()
            {
                new()
                {
                    Id = 1,
                    ItemId = expectedItemId,
                    TagId = 1
                },
                new()
                {
                    Id = 2,
                    ItemId = expectedItemId,
                    TagId = 2
                }
            });
    }
    
    [Fact]
    public void Creating_item_must_fail_if_user_is_invalid()
    {
        //arrange
        var itemRepo = new TestItemRepository(Data);
        Data.Items.Add(new Item
        {
            Id = 1,
            Description = "Task 1",
            UserId = 123
        });
        Data.Items.Add(new Item
        {
            Id = 2,
            Description = "Task 2",
            UserId = 234
        });
        var userRepo = new TestUserRepository();
        var itemTagMappingRepo = new TestItemTagMappingRepo(Data);
        var sut = new ItemManager(itemRepo, userRepo, itemTagMappingRepo);
        var input = new ItemServiceModel()
        {
            Description = "New Task"
        };
        var expectedUserId = 123;

        //act and assert
        Assert.Throws<UserNotFoundException>(() => sut.CreateItem(input, expectedUserId));
        Data.Items.Count.ShouldBe(2);
    }
}