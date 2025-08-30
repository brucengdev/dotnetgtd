using Backend.Core.Manager;
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
        public void DeleteItem_endpoint_config()
        {
            var method = Utils.GetMethod<ItemsController>(nameof(ItemsController.DeleteItem));
            method.ShouldNotBeNull();

            var attributes = method?.GetCustomAttributes(typeof(HttpDeleteAttribute), true);
            attributes.Length.ShouldBeGreaterThan(0, "Must have HttpDelete attribute");

            var deleteAtr = attributes[0] as HttpDeleteAttribute;
            deleteAtr.Template.ShouldBe("[action]");
        
            attributes = method?.GetCustomAttributes(typeof(ServiceFilterAttribute<SecurityFilterAttribute>), true);
            attributes.Length.ShouldBeGreaterThan(0, "Must require authorization");

            var idParam = method?.GetParameters()[0];
            idParam.Name.ShouldBe("id");
            
            idParam.GetCustomAttributes(typeof(FromQueryAttribute), true).ShouldNotBeEmpty();
        }

        [Theory]
        [InlineData(12 ,223)]
        [InlineData(33 ,21)]
        public void DeleteItem_must_be_successful(int itemId, int userId)
        {
            //arrange
            var itemManager = new Mock<IItemManager>();
            var sut = new ItemsController(itemManager.Object);
            var controllerContext = new ControllerContext();
            sut.ControllerContext = controllerContext;
            controllerContext.HttpContext = new DefaultHttpContext();
            controllerContext.HttpContext.Items["UserId"] = userId;
            
            //act
            var response = sut.DeleteItem(itemId);
            
            //assert
            itemManager.Verify(im => im.DeleteItem(itemId,userId), Times.Once);
            itemManager.VerifyNoOtherCalls();
            response.ShouldBeOfType<OkResult>();
        }
        
        
        [Theory]
        [InlineData(12 ,223)]
        [InlineData(33 ,21)]
        public void DeleteItem_must_return_unauthorized_if_item_is_not_owned_by_user(int itemId, int userId)
        {
            //arrange
            var itemManager = new Mock<IItemManager>();
            itemManager.Setup(im => im.DeleteItem(itemId, userId))
                .Throws<UnauthorizedAccessException>();
            var sut = new ItemsController(itemManager.Object);
            var controllerContext = new ControllerContext();
            sut.ControllerContext = controllerContext;
            controllerContext.HttpContext = new DefaultHttpContext();
            controllerContext.HttpContext.Items["UserId"] = userId;
            
            //act
            var response = sut.DeleteItem(itemId);
            
            //assert
            response.ShouldBeOfType<UnauthorizedResult>();
        }
    }
}
