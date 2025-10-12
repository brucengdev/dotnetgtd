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
    public void Updating_item_is_successful(string desc, bool done, bool later)
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
            Id = 1,
            Description = desc,
            ProjectId = 2,
            TagIds = [1, 2],
            Done = done,
            Later = later,
            UserId = 123
        };

        //act
        sut.UpdateItem(input, 123);

        //assert
        Data.Items.Count.ShouldBe(2);
        var savedItem = Data.Items.FirstOrDefault(i => i.Id == 1);
        savedItem.ShouldBe(new Item
        {
            Id = 1,
            Description = desc,
            UserId = 123,
            ProjectId = 2,
            Done = done,
            Later = later
        });

        Data.ItemTagMappings.Where(m => m.ItemId == 1)
            .ShouldBe(new List<ItemTagMapping>()
            {
                new()
                {
                    Id = 1,
                    ItemId = 1,
                    TagId = 1
                },
                new()
                {
                    Id = 2,
                    ItemId = 1,
                    TagId = 2
                }
            });
    }
    
    [Fact]
    public void Updating_item_must_fail_if_user_is_invalid()
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
            Id = 1,
            Description = "New Task",
            UserId = 123
        };
        var currentUserId = 123;

        //act and assert
        Assert.Throws<UserNotFoundException>(() => sut.UpdateItem(input, currentUserId));
        Data.Items.Count.ShouldBe(2);
    }
    
    [Fact]
    public void Updating_item_must_throw_unauthorized_if_user_does_not_own_the_item()
    {
        //arrange
        var itemRepo = new TestItemRepository(Data);
        Data.Items.Add(new Item
        {
            Id = 2,
            Description = "Task 2",
            UserId = 234
        });
        var userRepo = new TestUserRepository();
        userRepo.AddUser(new()
        {
            Id = 123,
            Username = "testuser"
        });
        var itemTagMappingRepo = new TestItemTagMappingRepo(Data);
        var sut = new ItemManager(itemRepo, userRepo, itemTagMappingRepo);
        var input = new ItemServiceModel()
        {
            Id = 2,
            Description = "New Task",
            UserId = 123
        };
        var currentUserId = 123;

        //act and assert
        var exception = Assert.Throws<UnauthorizedAccessException>(
            () => sut.UpdateItem(input, currentUserId));
        exception.Message.ShouldBe("User does not own this item");
        Data.Items.Count.ShouldBe(1);
    }
    
    [Fact]
    public void Updating_item_must_throw_argumentexception_if_user_does_not_match_current_user_id()
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
        userRepo.AddUser(new()
        {
            Id = 123,
            Username = "testuser"
        });
        var itemTagMappingRepo = new TestItemTagMappingRepo(Data);
        var sut = new ItemManager(itemRepo, userRepo, itemTagMappingRepo);
        var input = new ItemServiceModel()
        {
            Id = 1,
            Description = "New Task",
            UserId = 234
        };
        var currentUserId = 123;

        //act and assert
        var exception = Assert.Throws<ArgumentException>(
            () => sut.UpdateItem(input, currentUserId));
        exception.Message.ShouldBe("UserId field must be the same as current logged in user's");
        Data.Items.Count.ShouldBe(2);
    }
    
    [Fact]
    public void Updating_item_must_throw_notfound_if_item_does_not_exist()
    {
        //arrange
        var itemRepo = new TestItemRepository(Data);
        var userRepo = new TestUserRepository();
        userRepo.AddUser(new()
        {
            Id = 123,
            Username = "testuser"
        });
        var itemTagMappingRepo = new TestItemTagMappingRepo(Data);
        var sut = new ItemManager(itemRepo, userRepo, itemTagMappingRepo);
        var input = new ItemServiceModel()
        {
            Id = 15,
            Description = "New Task",
            UserId = 123
        };
        var currentUserId = 123;

        //act and assert
        Assert.Throws<ItemNotFoundException>(
            () => sut.UpdateItem(input, currentUserId));
        Data.Items.Count.ShouldBe(0);
    }
}