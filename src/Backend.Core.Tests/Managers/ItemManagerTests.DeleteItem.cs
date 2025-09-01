using Backend.Core.Manager;
using Backend.Core.Repository;
using Backend.Core.Tests.Mocks;
using Backend.Models;
using Backend.WebApi.Repository;
using Microsoft.Identity.Client;
using Moq;
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
        var sut = new ItemManager(repo, new Mock<IUserRepository>().Object, new TestItemTagMappingRepo());
        
        //act
        sut.DeleteItem(2, 23);
        
        //assert
        repo.Items.Count.ShouldBe(2);
        repo.Items.ShouldBe(new List<Item>
        {
            new() { Id = 1, Description = "Task A", UserId = 1 },
            new() { Id = 3, Description = "Task C", UserId = 3 }
        });
    }
    
    [Fact]
    public void DeleteItem_must_fail_if_item_does_not_belong_to_user()
    {
        //arrange
        var repo = new TestItemRepository();
        repo.Items = new List<Item>
        {
            new() { Id = 1, Description = "Task A", UserId = 1 },
            new() { Id = 2, Description = "Task B", UserId = 23 },
            new() { Id = 3, Description = "Task C", UserId = 3 }
        };
        var sut = new ItemManager(repo, new Mock<IUserRepository>().Object, new TestItemTagMappingRepo());
        
        //act and assert
        var exception = Assert.Throws<UnauthorizedAccessException>(() => sut.DeleteItem(1, 23));
        
        //assert
        exception.Message.ShouldBe("User is not allowed to delete items owned by other users");
        repo.Items.ShouldBe(new List<Item>
        {
            new() { Id = 1, Description = "Task A", UserId = 1 },
            new() { Id = 2, Description = "Task B", UserId = 23 },
            new() { Id = 3, Description = "Task C", UserId = 3 }
        });
    }
    
    [Fact]
    public void DeleteItem_must_fail_if_item_does_not_exist()
    {
        //arrange
        var repo = new TestItemRepository();
        repo.Items = new List<Item>
        {
            new() { Id = 1, Description = "Task A", UserId = 1 },
            new() { Id = 2, Description = "Task B", UserId = 23 },
            new() { Id = 3, Description = "Task C", UserId = 3 }
        };
        var sut = new ItemManager(repo, new Mock<IUserRepository>().Object, new TestItemTagMappingRepo());
        
        //act and assert
        Assert.Throws<ItemNotFoundException>(() => sut.DeleteItem(4, 23));
        
        //assert
        repo.Items.ShouldBe(new List<Item>
        {
            new() { Id = 1, Description = "Task A", UserId = 1 },
            new() { Id = 2, Description = "Task B", UserId = 23 },
            new() { Id = 3, Description = "Task C", UserId = 3 }
        });
    }
}