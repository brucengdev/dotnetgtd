using Backend.Core.Manager;
using Backend.Core.Tests.Mocks;
using Backend.Models;
using Shouldly;

namespace Backend.Core.Tests;

public partial class TagManagerTests
{
    [Fact]
    public void Create_tag_must_be_successful()
    {
        //arrange
        var userRepo = new TestUserRepository();
        userRepo.AddUser(new User
        {
            Id = 123,
            Username = "user1",
            PasswordHash = AccountManagerTests.HashPassword("pass")
        });
        var data = new TestDataSource();
        var tagRepo = new TestTagRepository(data);
        var sut = new TagManager(tagRepo, userRepo);
        
        //act
        var tagId = sut.CreateTag(new TagServiceModel()
        {
            Name = "Tag Name",
            Id = 0
        }, 123);
        
        //assert
        data.Tags.Count.ShouldBe(1);
        var savedItem = data.Tags[0];
        savedItem.ShouldBe(new Tag
        {
            Name = "Tag Name",
            Id = tagId,
            UserId = 123
        });
    } 
    
    [Fact]
    public void Create_tag_must_return_user_not_found_error_with_invalid_user()
    {
        //arrange
        var userRepo = new TestUserRepository();
        var data = new TestDataSource();
        var tagRepo = new TestTagRepository(data);
        var sut = new TagManager(tagRepo, userRepo);
        
        //act and assert
        Assert.Throws<UserNotFoundException>(() => sut.CreateTag(new TagServiceModel()
        {
            Name = "Tag Name",
            Id = 0
        }, 123));
        
        //assert
        data.Tags.Count.ShouldBe(0);
    } 
}