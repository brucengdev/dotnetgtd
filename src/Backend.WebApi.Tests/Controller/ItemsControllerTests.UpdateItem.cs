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
        public void UpdateItem_endpoint_config()
        {
            var method = Utils.GetMethod<ItemsController>(nameof(ItemsController.UpdateItem));
            method.ShouldNotBeNull();

            var attributes = method?.GetCustomAttributes(typeof(HttpPutAttribute), true);
            attributes.Length.ShouldBeGreaterThan(0, "Must have HttpPUT attribute");

            var putAttr = attributes[0] as HttpPutAttribute;
            putAttr.Template.ShouldBe("[action]");
        
            attributes = method?.GetCustomAttributes(typeof(ServiceFilterAttribute<SecurityFilterAttribute>), true);
            attributes.Length.ShouldBeGreaterThan(0, "Must require authorization");
        }
        //
        // [Fact]
        // public void Item_must_be_updated()
        // {
        //     //arrange
        //     var itemManager = new Mock<IItemManager>();
        //     var expectedItemId = 256;
        //     itemManager.Setup(im => im.CreateItem(It.IsAny<ItemServiceModel>(), It.IsAny<int>()))
        //         .Returns(expectedItemId);
        //     var sut = new ItemsController(itemManager.Object);
        //     sut.ControllerContext = new ControllerContext();
        //     sut.ControllerContext.HttpContext = new DefaultHttpContext();
        //     sut.HttpContext.Items["UserId"] = 123;
        //
        //     //act
        //     var item = new ItemServiceModel
        //     {
        //         Description = "Foo",
        //         ProjectId = 1,
        //         TagIds = new List<int>{1, 2},
        //         Done = false,
        //         Later = false
        //     };
        //     var response = sut.CreateItem(item);
        //
        //     //assert
        //     itemManager.Verify(im => im.CreateItem(item, 123), Times.Once);
        //     itemManager.VerifyNoOtherCalls();
        //     
        //     response.ShouldBeOfType<OkObjectResult>();
        //     var result = response as OkObjectResult;
        //     result?.StatusCode.ShouldBe((int)HttpStatusCode.OK);
        //     result?.Value.ShouldBe(expectedItemId);
        // }
    }
}
