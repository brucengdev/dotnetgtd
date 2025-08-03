using Backend.Core.Manager;
using Backend.Core.Tests.Mocks;
using Backend.Models;
using Shouldly;

namespace Backend.Core.Tests;

public partial class ItemManagerTests
{
    [Fact]
    public void GetItems_is_successful()
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
        var expectedUserId = 123;

        //act
        var items = sut.GetItems(expectedUserId);

        //assert
        items.ShouldBe(new List<Item>()
        {
            new () {
                Id = 1,
                Description = "Task 1",
                UserId = 123
            }
        });
    }
}