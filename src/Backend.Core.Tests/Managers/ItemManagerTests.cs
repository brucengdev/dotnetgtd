using Backend.Core.Manager;
using Backend.Core.Repository;
using Backend.Models;
using Moq;

namespace Backend.Core.Tests;

public class ItemManagerTests
{
    [Fact]
    public void Creating_item_is_successful()
    {
        //arrange
        var repo = new Mock<IItemRepository>();
        var sut = new ItemManager(repo.Object);
        var item = new Item
        {
            Description = "Foo"
        };

        //act
        var itemId = sut.CreateItem(item, 123);

        //assert
        
    }
}