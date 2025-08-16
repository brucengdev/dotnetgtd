using System.Net;
using Backend.Core.Manager;
using Backend.Models;
using Backend.WebApi.ActionFilters;
using Backend.WebApi.Controllers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Shouldly;

namespace Backend.WebApi.Tests.Controller
{
    public partial class ProjectsControllerTests
    {
        [Fact]
        public void CreateProject_endpoint_config()
        {
            var method = Utils.GetMethod<ProjectsController>(nameof(ProjectsController.CreateProject));
            method.ShouldNotBeNull();

            var attributes = method?.GetCustomAttributes(typeof(HttpPostAttribute), true);
            attributes.Length.ShouldBeGreaterThan(0, "Must have HttpPOST attribute");

            var postAttr = attributes[0] as HttpPostAttribute;
            postAttr.Template.ShouldBe("[action]");
        
            attributes = method?.GetCustomAttributes(typeof(ServiceFilterAttribute<SecurityFilterAttribute>), true);
            attributes.Length.ShouldBeGreaterThan(0, "Must require authorization");
        }
        //
        // [Fact]
        // public void Project_must_be_created()
        // {
        //     //arrange
        //     var itemManager = new Mock<IItemManager>();
        //     var expectedItemId = 256;
        //     itemManager.Setup(im => im.CreateProject(It.IsAny<Item>(), It.IsAny<int>()))
        //         .Returns(expectedItemId);
        //     var sut = new ItemsController(itemManager.Object);
        //     sut.ControllerContext = new ControllerContext();
        //     sut.ControllerContext.HttpContext = new DefaultHttpContext();
        //     sut.HttpContext.Items["UserId"] = 123;
        //
        //     //act
        //     var item = new Item
        //     {
        //         Description = "Foo"
        //     };
        //     var response = sut.CreateProject(item);
        //
        //     //assert
        //     itemManager.Verify(im => im.CreateProject(item, 123), Times.Once);
        //     itemManager.VerifyNoOtherCalls();
        //     
        //     response.ShouldBeOfType<OkObjectResult>();
        //     var result = response as OkObjectResult;
        //     result?.StatusCode.ShouldBe((int)HttpStatusCode.OK);
        //     result?.Value.ShouldBe(expectedItemId);
        // }
    }
}
