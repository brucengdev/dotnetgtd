using Backend.Core.Manager;
using Backend.Core.Tests.Mocks;
using Backend.Models;
using Backend.WebApi.Repository;
using Shouldly;

namespace Backend.Core.Tests;

public partial class ItemManagerTests
{
    [Fact]
    public void DeleteItem_must_be_successful()
    {
        //arrange
        var repo = new TestItemRepository();
        repo.Items = new List<Item>
        {
            new() { Id = 1, Description = "Task A", UserId = 1 },
            new() { Id = 2, Description = "Task B", UserId = 23 },
            new() { Id = 3, Description = "Task C", UserId = 3 }
        };
        var sut = new ItemManager(repo);
        
        //act
        sut.DeleteItem(2, 23);
        
        //assert
        repo.Items.Count.ShouldBe(2);
    }
}