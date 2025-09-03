using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Shouldly;

namespace Backend.WebApi.Tests;

public class SeedDataTests
{
    [Fact]
    public void Must_add_admin_user_with_specified_salt()
    {
        //arrange
        var dbContextOptionsBuilder = new DbContextOptionsBuilder<GTDContext>();
        dbContextOptionsBuilder.UseInMemoryDatabase("testdb");
        var contextOptions = dbContextOptionsBuilder.Options;
        var context = new GTDContext(contextOptions);
        var salt = "abcdef";
        
        //act
        SeedData.Initialize(context, salt);
        
        //assert
        context.Users.Count().ShouldBe(1);
    }
}