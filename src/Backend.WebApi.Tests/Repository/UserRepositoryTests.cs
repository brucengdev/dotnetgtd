using Backend.WebApi.Repository;
using Backend.WebApi.Tests.Controller;
using Shouldly;

namespace Backend.WebApi.Tests.Repository;

public class UserRepositoryTests
{
    [Theory]
    [InlineData(12, true)]
    [InlineData(13, false)]
    public void UserExists_with_user_ID_tests(int userId, bool expected)
    {
        //arrange
        var db = Utils.CreateTestDB();
        db.Users.Add(new()
        {
            Id = 1,
            Username = "User1",
            PasswordHash = "somehash"
        });
        db.Users.Add(new()
        {
            Id = 12,
            Username = "User12",
            PasswordHash = "somehash2"
        });
        db.SaveChanges();
        var sut = new UserRepository(db);
        
        //arrange
        var actual = sut.UserExists(userId);
        
        //assert
        actual.ShouldBe(expected);
    }
}