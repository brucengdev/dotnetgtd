using Backend.WebApi.Controllers;
using Microsoft.AspNetCore.Mvc;
using Shouldly;

namespace Backend.WebApi.Tests.Controller;

public partial class ProjectsControllerTests
{
    [Fact]
    public void Controller_config()
    {
        typeof(ProjectsController).IsVisible.ShouldBeTrue();
        
        Attribute.GetCustomAttribute(typeof(ProjectsController), typeof(ApiControllerAttribute))
            .ShouldNotBeNull();

        var routeAttr = Attribute.GetCustomAttribute(typeof(ProjectsController), typeof(RouteAttribute))
            as RouteAttribute;
        routeAttr.ShouldNotBeNull();
        routeAttr.Template.ShouldBe("[controller]");
        
        typeof(ProjectsController).BaseType
            .IsAssignableTo(typeof(ControllerBase)).ShouldBeTrue();
    }
}
