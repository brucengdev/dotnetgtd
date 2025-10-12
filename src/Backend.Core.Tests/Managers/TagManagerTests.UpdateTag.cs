using Backend.Core.Manager;
using Backend.Core.Tests.Mocks;
using Backend.Models;
using Shouldly;

namespace Backend.Core.Tests;

public partial class TagManagerTests
{
    [Fact]
    public void Update_tag_must_be_successful()
    {
        //arrange
        var userRepo = new TestUserRepository();
        userRepo.AddUser(new User
        {
            Id = 123,
            Username = "user1",
            PasswordHash = AccountManagerTests.HashPassword("pass")
        });
        var tagRepo = new TestTagRepository();
        tagRepo.Tags.Add(new()
        {
            Id = 1,
            Name = "Tag Name",
            UserId = 123
        });
        var sut = new TagManager(tagRepo, userRepo);
        
        //act
        sut.UpdateTag(new Tag
        {
            Id = 1,
            Name = "Tag Name Updated",
            UserId = 123
        }, 123);
        
        //assert
        tagRepo.Tags.Count.ShouldBe(1);
        var savedItem = tagRepo.Tags[0];
        savedItem.ShouldBe(new Tag
        {
            Id = 1,
            Name = "Tag Name Updated",
            UserId = 123
        });
    } 
}