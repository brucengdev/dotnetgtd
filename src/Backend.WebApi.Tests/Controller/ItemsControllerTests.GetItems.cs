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
    public partial class ItemsControllerTests
    {
        [Fact]
        public void GetItems_endpoint_config()
        {
            var method = Utils.GetMethod<ItemsController>(nameof(ItemsController.GetItems));
            method.ShouldNotBeNull();

            var attributes = method?.GetCustomAttributes(typeof(HttpGetAttribute), true);
            attributes.Length.ShouldBeGreaterThan(0, "Must have HttpGet attribute");

            var getAttr = attributes[0] as HttpGetAttribute;
            getAttr.Template.ShouldBe("[action]");
        
            attributes = method?.GetCustomAttributes(typeof(ServiceFilterAttribute<SecurityFilterAttribute>), true);
            attributes.Length.ShouldBeGreaterThan(0, "Must require authorization");
        }
        
        [Fact]
        public void GetItems_must_return_all_items()
        {
            //arrange
            var itemManager = new Mock<IItemManager>();
            itemManager.Setup(im => im.GetItems(It.IsAny<int>()))
                .Returns(new List<ItemServiceModel>()
                {
                    new () { Id=1, Description = "Task A", UserId = 123, ProjectId = 1},
                    new () { Id=2, Description = "Task B", UserId = 123, ProjectId = 2}
                });
            var sut = new ItemsController(itemManager.Object);
            sut.ControllerContext = new ControllerContext();
            sut.ControllerContext.HttpContext = new DefaultHttpContext();
            sut.HttpContext.Items["UserId"] = 123;
        
            //act
            var response = sut.GetItems();
        
            //assert
            itemManager.Verify(im => im.GetItems(123), Times.Once);
            itemManager.VerifyNoOtherCalls();
            
            response.ShouldBeOfType<OkObjectResult>();
            var result = response as OkObjectResult;
            result?.StatusCode.ShouldBe((int)HttpStatusCode.OK);
            result?.Value.ShouldBe(new List<ItemServiceModel>()
            {
                new () { Id=1, Description = "Task A", UserId = 123, ProjectId = 1},
                new () { Id=2, Description = "Task B", UserId = 123, ProjectId = 2}
            });
        }
    }
}
