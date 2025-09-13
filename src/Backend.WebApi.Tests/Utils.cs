using System.Reflection;
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
}