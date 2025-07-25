using Backend.Core.Manager;
using Backend.Core.Tests.Mocks;
using Backend.Models;
using Shouldly;

namespace Backend.Core.Tests;

public class ItemManagerTests
{
    [Fact]
    public void Creating_item_is_successful()
    {
        //arrange
        var repo = new TestItemRepository();
        repo.Items.Add(new Item
        {
            Id = 1,
            Description = "Task 1",
            UserId = 123
        });
        repo.Items.Add(new Item
        {
            Id = 2,
            Description = "Task 2",
            UserId = 234
        });
        var sut = new ItemManager(repo);
        var input = new Item
        {
            Description = "New Task"
        };
        var expectedUserId = 123;

        //act
        var itemId = sut.CreateItem(input, expectedUserId);

        //assert
        var expectedItemId = 3;
        itemId.ShouldBe(expectedItemId);
        repo.Items.Count.ShouldBe(3);
        var savedItem = repo.Items[repo.Items.Count - 1];
        savedItem.ShouldBe(new Item
        {
            Id = expectedItemId,
            Description = "New Task",
            UserId = expectedUserId
        });
    }
}