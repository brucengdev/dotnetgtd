using Backend.Core.Manager;
using Backend.Core.Tests.Mocks;
using Backend.Models;
using Shouldly;

namespace Backend.Core.Tests;

public partial class ItemManagerTests
{
    [Fact]
    public void Creating_item_is_successful()
    {
        //arrange
        var itemRepo = new TestItemRepository();
        itemRepo.Items.Add(new Item
        {
            Id = 1,
            Description = "Task 1",
            UserId = 123,
            ProjectId = null
        });
        itemRepo.Items.Add(new Item
        {
            Id = 2,
            Description = "Task 2",
            UserId = 234,
            ProjectId = 1
        });
        var userRepo = new TestUserRepository();
        userRepo.AddUser(new()
        {
            Id = 123,
            Username = "testuser"
        });
        var sut = new ItemManager(itemRepo, userRepo);
        var input = new CreateItemModel
        {
            Description = "New Task",
            ProjectId = 2,
            TagIds = [1, 2]
        };
        var expectedUserId = 123;

        //act
        var itemId = sut.CreateItem(input, expectedUserId);

        //assert
        var expectedItemId = 3;
        itemId.ShouldBe(expectedItemId);
        itemRepo.Items.Count.ShouldBe(3);
        var savedItem = itemRepo.Items[itemRepo.Items.Count - 1];
        savedItem.ShouldBe(new Item
        {
            Id = expectedItemId,
            Description = "New Task",
            UserId = expectedUserId,
            ProjectId = 2
        });
    }
    
    [Fact]
    public void Creating_item_must_fail_if_user_is_invalid()
    {
        //arrange
        var itemRepo = new TestItemRepository();
        itemRepo.Items.Add(new Item
        {
            Id = 1,
            Description = "Task 1",
            UserId = 123
        });
        itemRepo.Items.Add(new Item
        {
            Id = 2,
            Description = "Task 2",
            UserId = 234
        });
        var userRepo = new TestUserRepository();
        var sut = new ItemManager(itemRepo, userRepo);
        var input = new CreateItemModel()
        {
            Description = "New Task"
        };
        var expectedUserId = 123;

        //act and assert
        Assert.Throws<UserNotFoundException>(() => sut.CreateItem(input, expectedUserId));
        itemRepo.Items.Count.ShouldBe(2);
    }
}