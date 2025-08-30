using Backend.Core.Manager;
using Backend.Models;
using Backend.Core.Tests.Mocks;
using Shouldly;

namespace Backend.Core.Tests
{
    public partial class AccountManagerTests
    {
        [Fact]
        public void CreateAccessToken_correct_user()
        {
            //arrange
            var userRepo = new TestUserRepository();
            var testUser = new User
            {
                Username = "johndoe",
                PasswordHash = HashPassword("testPassword")
            };
            userRepo.AddUser(testUser);
            var sut = new AccountManager(userRepo, AccountManagerTests.HashSalt);
            
            //act
            var creationTime = new DateTime(2024, 12, 31, 18, 4, 0);
            var result = sut.CreateAccessToken("johndoe", "testPassword", creationTime);
            
            //assert
            result.ShouldBe(Utilities.Token("johndoe-2024-12-31-19-04", "testPassword"));
        }

        [Fact]
        public void CreateAccessToken_incorrect_password()
        {
            //arrange
            var userRepo = new TestUserRepository();
            userRepo.AddUser(new User
            {
                Username = "johndoe",
                PasswordHash = HashPassword("testPassword")
            });
            var sut = new AccountManager(userRepo, AccountManagerTests.HashSalt);

            //act & assert
            Should.Throw<WrongPasswordException>(
                () => sut.CreateAccessToken("johndoe", "testpassword222", DateTime.Now)
            );
        }
        
        [Fact]
        public void CreateAccessToken_incorrect_user()
        {
            //arrange
            var userRepo = new TestUserRepository();
            userRepo.AddUser(new User
            {
                Username = "johndoe",
                PasswordHash = HashPassword("testPassword")
            });
            var sut = new AccountManager(userRepo, AccountManagerTests.HashSalt);

            //act and assert
            Should.Throw<UserNotFoundException>(
                () => sut.CreateAccessToken("johndoe2", "testpassword222", DateTime.Now)
            );
        }
    }
}