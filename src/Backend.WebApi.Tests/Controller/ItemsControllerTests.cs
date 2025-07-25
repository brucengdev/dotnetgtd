using Backend.WebApi.Controllers;
using Microsoft.AspNetCore.Mvc;
using Shouldly;

namespace Backend.WebApi.Tests.Controller;

public partial class ItemsControllerTests
{
    [Fact]
    public void Controller_config()
    {
        typeof(ItemsController).IsVisible.ShouldBeTrue();
        
        Attribute.GetCustomAttribute(typeof(ItemsController), typeof(ApiControllerAttribute))
            .ShouldNotBeNull();

        var routeAttr = Attribute.GetCustomAttribute(typeof(ItemsController), typeof(RouteAttribute))
            as RouteAttribute;
        routeAttr.ShouldNotBeNull();
        routeAttr.Template.ShouldBe("[controller]");
        
        typeof(ItemsController).BaseType
            .IsAssignableTo(typeof(ControllerBase)).ShouldBeTrue();
    }
}
