using System.Security.Cryptography;
using System.Text;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Shouldly;

namespace Backend.WebApi.Tests;

public class SeedDataTests
{
    [Fact]
    public void Must_add_admin_user_with_specified_salt_and_password()
    {
        //arrange
        var dbContextOptionsBuilder = new DbContextOptionsBuilder<GTDContext>();
        dbContextOptionsBuilder.UseInMemoryDatabase("testdb");
        var contextOptions = dbContextOptionsBuilder.Options;
        var context = new GTDContext(contextOptions);
        var salt = "abcdef";
        var adminPassword = "adminPassword";
        
        //act
        SeedData.Initialize(context, adminPassword, salt);
        
        //assert
        context.Users.Count().ShouldBe(1);
        var admin = context.Users.Single();
        admin.Username.ShouldBe("admin");
        admin.PasswordHash.ShouldBe(CreateHash(adminPassword, salt));
    }

    private string CreateHash(string input, string salt)
    {
        using var algo = SHA256.Create();
        var phraseToHash = input + salt;
        var hash = algo.ComputeHash(Encoding.UTF8.GetBytes(phraseToHash));
        return Convert.ToBase64String(hash);
    }
}