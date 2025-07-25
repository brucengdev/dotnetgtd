using Backend.Core.Manager;
using Backend.Core.Repository;
using Backend.Core.Tests.Mocks;
using Backend.Models;
using Moq;
using Shouldly;

namespace Backend.Core.Tests;

public class ItemManagerTests
{
    [Fact]
    public void Creating_item_is_successful()
    {
        //arrange
        var repo = new TestItemRepository();
        var sut = new ItemManager(repo);
        var item = new Item
        {
            Description = "Foo"
        };

        //act
        var itemId = sut.CreateItem(item, 123);

        //assert
        itemId.ShouldBe(1);
        repo.Items.Count.ShouldBe(1);
    }
}