using System.Security.Cryptography;
using System.Text;
using Backend.Core.Manager;
using Backend.Models;
using Backend.Core.Tests.Mocks;
using Shouldly;

namespace Backend.Core.Tests
{
    public partial class AccountManagerTests
    {
        [Fact]
        public void Verify_correct_user()
        {
            //arrange
            var userRepo = new TestUserRepository();
            userRepo.AddUser(new User
            {
                Username = "johndoe",
                Password = "testPassword"
            });
            var sut = new AccountManager(userRepo);
            
            //act
            var creationTime = new DateTime(2024, 12, 31, 18, 4, 0);
            var result = sut.CreateAccessToken("johndoe", "testPassword", creationTime);
            
            //assert
            var info = "johndoe-2024-12-31-19-04";
            var hashedDataAndPassword = CreateHash(info + "testPassword");

            var expectedToken = info + "-" + hashedDataAndPassword;
            result.ShouldBe(expectedToken);
        }

        private string CreateHash(string input)
        {
            using var algo = SHA256.Create();
            var hash = algo.ComputeHash(Encoding.UTF8.GetBytes(input));
            return Convert.ToBase64String(hash);
        }

        [Fact]
        public void Verify_incorrect_password()
        {
            //arrange
            var userRepo = new TestUserRepository();
            userRepo.AddUser(new User
            {
                Username = "johndoe",
                Password = "testPassword"
            });
            var sut = new AccountManager(userRepo);

            //act & assert
            Should.Throw<WrongPasswordException>(
                () => sut.CreateAccessToken("johndoe", "testpassword222", DateTime.Now)
            );
        }
        
        [Fact]
        public void Verify_incorrect_user()
        {
            //arrange
            var userRepo = new TestUserRepository();
            userRepo.AddUser(new User
            {
                Username = "johndoe",
                Password = "testPassword"
            });
            var sut = new AccountManager(userRepo);

            //act and assert
            Should.Throw<UserNotFoundException>(
                () => sut.CreateAccessToken("johndoe2", "testpassword222", DateTime.Now)
            );
        }
    }
}