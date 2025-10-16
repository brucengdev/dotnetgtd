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
        
        [Theory]
        [InlineData(1)]
        [InlineData(22)]
        public void Item_must_be_updated(int userId)
        {
            //arrange
            var itemManager = new Mock<IItemManager>();
            var sut = new ItemsController(itemManager.Object);
            sut.ControllerContext = new ControllerContext();
            sut.ControllerContext.HttpContext = new DefaultHttpContext();
            sut.HttpContext.Items["UserId"] = userId;
        
            //act
            var item = new ItemServiceModel
            {
                Id = 2,
                Description = "Foo",
                ProjectId = 1,
                TagIds = new List<int>{1, 2},
                Done = false,
                Later = false
            };
            var response = sut.UpdateItem(item);
        
            //assert
            itemManager.Verify(im => im.UpdateItem(item, userId), Times.Once);
            itemManager.VerifyNoOtherCalls();
            
            response.ShouldBeOfType<OkResult>();
            var result = response as OkResult;
            result?.StatusCode.ShouldBe((int)HttpStatusCode.OK);
        }
        
        [Fact]
        public void Must_return_404_if_item_is_not_found()
        {
            //arrange
            var itemManager = new Mock<IItemManager>();
            itemManager.Setup(im => im.UpdateItem(It.IsAny<ItemServiceModel>(), It.IsAny<int>()))
                .Throws(new ItemNotFoundException());
            var sut = new ItemsController(itemManager.Object);
            sut.ControllerContext = new ControllerContext();
            sut.ControllerContext.HttpContext = new DefaultHttpContext();
            sut.HttpContext.Items["UserId"] = 123;
        
            //act
            var item = new ItemServiceModel
            {
                Id = 2,
                Description = "Foo",
                ProjectId = 1,
                TagIds = new List<int>{1, 2},
                Done = false,
                Later = false
            };
            var response = sut.UpdateItem(item);
        
            //assert
            itemManager.Verify(im => im.UpdateItem(item, 123), Times.Once);
            itemManager.VerifyNoOtherCalls();
            
            response.ShouldBeOfType<NotFoundResult>();
            var result = response as NotFoundResult;
            result?.StatusCode.ShouldBe((int)HttpStatusCode.NotFound);
        }
        
        [Fact]
        public void Must_return_Unauthorized_if_user_is_not_allowed_to_edit_item()
        {
            //arrange
            var itemManager = new Mock<IItemManager>();
            itemManager.Setup(im => im.UpdateItem(It.IsAny<ItemServiceModel>(), It.IsAny<int>()))
                .Throws(new UnauthorizedAccessException());
            var sut = new ItemsController(itemManager.Object);
            sut.ControllerContext = new ControllerContext();
            sut.ControllerContext.HttpContext = new DefaultHttpContext();
            sut.HttpContext.Items["UserId"] = 123;
        
            //act
            var item = new ItemServiceModel
            {
                Id = 2,
                Description = "Foo",
                ProjectId = 1,
                TagIds = new List<int>{1, 2},
                Done = false,
                Later = false
            };
            var response = sut.UpdateItem(item);
        
            //assert
            itemManager.Verify(im => im.UpdateItem(item, 123), Times.Once);
            itemManager.VerifyNoOtherCalls();
            
            response.ShouldBeOfType<UnauthorizedResult>();
            var result = response as UnauthorizedResult;
            result?.StatusCode.ShouldBe((int)HttpStatusCode.Unauthorized);
        }
    }
}
