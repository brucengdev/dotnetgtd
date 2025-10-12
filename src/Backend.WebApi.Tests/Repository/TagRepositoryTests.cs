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
}