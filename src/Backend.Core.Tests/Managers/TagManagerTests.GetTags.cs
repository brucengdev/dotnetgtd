using Backend.Core.Manager;
using Backend.Core.Tests.Mocks;
using Backend.Models;
using Shouldly;

namespace Backend.Core.Tests;

public partial class TagManagerTests
{
    [Fact]
    public void GetTags_must_be_successful()
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
        var tags = sut.GetTags(123);
        
        //assert
        tags.ShouldBe(new List<TagServiceModel>
        {
            new() { Id = 1, Name = "Tag A" },
            new() { Id = 3, Name = "Tag C" }
        });
    } 
}