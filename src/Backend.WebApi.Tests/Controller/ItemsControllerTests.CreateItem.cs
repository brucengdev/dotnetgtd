using Backend.Core.Manager;
using Backend.Models;
using Backend.WebApi.ActionFilters;
using Backend.WebApi.Controllers;
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
        public void Item_must_be_added()
        {
            //arrange
            var itemManager = new Mock<IItemManager>();
            var sut = new ItemsController(itemManager.Object);

            //act
            var item = new Item
            {
                Description = "Foo"
            };
            sut.CreateItem(item);

            //assert
            itemManager.Verify(im => im.CreateItem(item), Times.Once);
            itemManager.VerifyNoOtherCalls();
        }
    }
}
