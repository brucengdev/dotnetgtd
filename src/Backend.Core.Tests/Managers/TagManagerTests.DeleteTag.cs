using Backend.Core.Manager;
using Backend.Core.Tests.Mocks;
using Backend.Models;
using Shouldly;

namespace Backend.Core.Tests;

public partial class TagManagerTests
{
    [Fact]
    public void DeleteTag_must_be_successful()
    {
        //arrange
        var userRepo = new TestUserRepository();
        userRepo.AddUser(new User
        {
            Id = 123,
            PasswordHash = AccountManagerTests.HashPassword("pass"),
            Username = "user1"
        });
        var data = new TestDataSource();
        var tagRepo = new TestTagRepository(data);
        data.Tags = new List<Tag>
        {
            new() { Id = 1, Name = "Tag A", UserId = 123 },
            new() { Id = 2, Name = "Tag B", UserId = 456 },
            new() { Id = 3, Name = "Tag C", UserId = 123 },
            new() { Id = 4, Name = "Tag D", UserId = 111 },
            new() { Id = 5, Name = "Tag E", UserId = 23 }
        };
        var sut = new TagManager(tagRepo, userRepo);
        
        //act
        sut.DeleteTag(3, 123);
        
        //assert
        data.Tags.ShouldBe(new List<Tag>
        {
            new() { Id = 1, Name = "Tag A", UserId = 123 },
            new() { Id = 2, Name = "Tag B", UserId = 456 },
            new() { Id = 4, Name = "Tag D", UserId = 111 },
            new() { Id = 5, Name = "Tag E", UserId = 23 }
        });
    }
    
    [Fact]
    public void DeleteTag_must_throw_unauthorized_exception_if_user_does_not_own_tag()
    {
        //arrange
        var userRepo = new TestUserRepository();
        userRepo.AddUser(new User
        {
            Id = 123,
            PasswordHash = AccountManagerTests.HashPassword("pass"),
            Username = "user1"
        });
        var data = new TestDataSource();
        var tagRepo = new TestTagRepository(data);
        data.Tags = new List<Tag>
        {
            new() { Id = 1, Name = "Tag A", UserId = 123 },
            new() { Id = 2, Name = "Tag B", UserId = 456 },
            new() { Id = 3, Name = "Tag C", UserId = 123 }
        };
        var sut = new TagManager(tagRepo, userRepo);
        
        //act and assert
        var exception = Assert.Throws<UnauthorizedAccessException>(
            () =>sut.DeleteTag(3, 245));
        exception.ShouldNotBeNull();
        exception.Message.ShouldBe("User does not own this tag");
        
        data.Tags.ShouldBe(new List<Tag>
        {
            new() { Id = 1, Name = "Tag A", UserId = 123 },
            new() { Id = 2, Name = "Tag B", UserId = 456 },
            new() { Id = 3, Name = "Tag C", UserId = 123 }
        });
    }
    
    
    [Fact]
    public void DeleteTag_must_throw_tag_not_found_exception_if_tag_is_nonexistent()
    {
        //arrange
        var userRepo = new TestUserRepository();
        userRepo.AddUser(new User
        {
            Id = 123,
            PasswordHash = AccountManagerTests.HashPassword("pass"),
            Username = "user1"
        });
        var data = new TestDataSource();
        var tagRepo = new TestTagRepository(data);
        data.Tags = new List<Tag>
        {
            new() { Id = 1, Name = "Tag A", UserId = 123 },
            new() { Id = 2, Name = "Tag B", UserId = 456 }
        };
        var sut = new TagManager(tagRepo, userRepo);
        
        //act and assert
        var exception = Assert.Throws<TagNotFoundException>(
            () =>sut.DeleteTag(3, 245));
        exception.ShouldNotBeNull();
        
        data.Tags.ShouldBe(new List<Tag>
        {
            new() { Id = 1, Name = "Tag A", UserId = 123 },
            new() { Id = 2, Name = "Tag B", UserId = 456 }
        });
    }
}