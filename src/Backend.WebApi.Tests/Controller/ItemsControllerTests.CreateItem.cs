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
        public void CreateItem_endpoint_config()
        {
            var method = Utils.GetMethod<ItemsController>(nameof(ItemsController.CreateItem));
            method.ShouldNotBeNull();

            var attributes = method?.GetCustomAttributes(typeof(HttpPostAttribute), true);
            attributes.Length.ShouldBeGreaterThan(0, "Must have HttpPOST attribute");

            var postAttr = attributes[0] as HttpPostAttribute;
            postAttr.Template.ShouldBe("[action]");
        
            attributes = method?.GetCustomAttributes(typeof(ServiceFilterAttribute<SecurityFilterAttribute>), true);
            attributes.Length.ShouldBeGreaterThan(0, "Must require authorization");
        }
        
        [Fact]
        public void Item_must_be_created()
        {
            //arrange
            var itemManager = new Mock<IItemManager>();
            var expectedItemId = 256;
            itemManager.Setup(im => im.CreateItem(It.IsAny<ItemRestModel>(), It.IsAny<int>()))
                .Returns(expectedItemId);
            var sut = new ItemsController(itemManager.Object);
            sut.ControllerContext = new ControllerContext();
            sut.ControllerContext.HttpContext = new DefaultHttpContext();
            sut.HttpContext.Items["UserId"] = 123;

            //act
            var item = new ItemRestModel
            {
                Description = "Foo",
                ProjectId = 1,
                TagIds = new List<int>{1, 2}
            };
            var response = sut.CreateItem(item);

            //assert
            itemManager.Verify(im => im.CreateItem(item, 123), Times.Once);
            itemManager.VerifyNoOtherCalls();
            
            response.ShouldBeOfType<OkObjectResult>();
            var result = response as OkObjectResult;
            result?.StatusCode.ShouldBe((int)HttpStatusCode.OK);
            result?.Value.ShouldBe(expectedItemId);
        }
    }
}
