using System.Reflection;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Shouldly;

namespace Backend.WebApi.Tests;

public class Utils
{
    public static MethodInfo? GetMethod<TClass>(string methodName)
    {
        return typeof(TClass).GetMethods()
            .SingleOrDefault(x => x.Name == methodName);
    }

    public static bool IsNullable(ParameterInfo parameterInfo)
    {
        return new NullabilityInfoContext().Create(parameterInfo).WriteState is NullabilityState.Nullable; 
    }
    
    public static void ShouldBeNullable(ParameterInfo parameterInfo)
    {
        IsNullable(parameterInfo).ShouldBeTrue();
    }

    public static GTDContext CreateTestDB()
    {
        var dbContextOptionsBuilder = new DbContextOptionsBuilder<GTDContext>();
        dbContextOptionsBuilder.UseInMemoryDatabase(Guid.NewGuid().ToString());
        var dbContext = new GTDContext(dbContextOptionsBuilder.Options);
        return dbContext;
    }
}