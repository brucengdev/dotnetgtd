using Backend.Models;
using Backend.WebApi.Repository;
using Shouldly;

namespace Backend.WebApi.Tests.Repository;

public class TagRepositoryTests
{
    [Theory]
    [InlineData(12, true)]
    [InlineData(13, false)]
    public void TagExists_with_tag_ID_tests(int tagId, bool expected)
    {
        //arrange
        var db = Utils.CreateTestDB();
        db.Tags.Add(new()
        {
            Id = 1,
            Name = "Tag 1"
        });
        db.Tags.Add(new()
        {
            Id = 12,
            Name = "Tag 12"
        });
        db.SaveChanges();
        var sut = new TagRepository(db);
        
        //arrange
        var actual = sut.TagExists(tagId);
        
        //assert
        actual.ShouldBe(expected);
    }
    
    [Fact]
    public void UpdateTag_test()
    {
        //arrange
        var db = Utils.CreateTestDB();
        db.Tags.Add(new()
        {
            Id = 12,
            Name = "Tag 12",
            UserId = 2
        });
        db.SaveChanges();
        var sut = new TagRepository(db);
        
        //arrange
        var updatedTag = new Tag()
        {
            Id = 12,
            Name = "Tag 12 updated",
            UserId = 2
        };
        sut.UpdateTag(updatedTag);
        
        //assert
        db.Tags.Count().ShouldBe(1);
        db.Tags.First().ShouldBe(updatedTag);
    }

    [Fact]
    public void Clear_tags_test()
    {
        //arrange
        var db = Utils.CreateTestDB();
        db.Tags.Add(new()
        {
            Id = 1,
            Name = "Tag 1",
            UserId = 2
        });
        db.Tags.Add(new()
        {
            Id = 2,
            Name = "Tag 2",
            UserId = 1
        });
        db.SaveChanges();
        var sut = new TagRepository(db);
        
        //act
        sut.Clear(2);
        
        //assert
        db.Tags.ShouldBe([
            new() {
                Id = 2,
                Name = "Tag 2",
                UserId = 1
            }
        ]);
    }
}