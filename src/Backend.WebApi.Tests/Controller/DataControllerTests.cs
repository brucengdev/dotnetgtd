using Backend.Models;
using Backend.WebApi.ActionFilters;
using Backend.WebApi.Controllers;
using Microsoft.AspNetCore.Mvc;
using Shouldly;

namespace Backend.WebApi.Tests.Controller;

public class DataControllerTests
{
    [Fact]
    public void Import_endpoint_config()
    {
        var method = Utils.GetMethod<DataController>(nameof(DataController.Import));
        method.ShouldNotBeNull();

        var attributes = method?.GetCustomAttributes(typeof(HttpPutAttribute), true);
        attributes.Length.ShouldBeGreaterThan(0, "Must have HttpPutAttribute");
        
        var putAttr = attributes[0] as HttpPutAttribute;
        putAttr.Template.ShouldBe("[action]");
        
        var secAttrs = method?.GetCustomAttributes(typeof(ServiceFilterAttribute<SecurityFilterAttribute>), true);
        secAttrs.Length.ShouldBe(1, "Must require authorization");
    }

    [Fact]
    public void Import_data_must_be_successful()
    {
        //arrange
        var sut = new DataController();

        //act
        var userData = new UserData();
        var response = sut.Import(userData);
        
        //assert
        response.ShouldBeOfType<OkResult>();
    }
}