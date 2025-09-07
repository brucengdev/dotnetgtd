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

        public static IEnumerable<object[]> GetItemsCases =
        [
            [ "", new List<bool>()],
            [ "completed,uncompleted", new List<bool>{ true, false }],
            [ "uncompleted,completed", new List<bool>{ false, true }],
            [ "completed", new List<bool>{ true }],
            [ "uncompleted", new List<bool>{ false }]
        ];
        [Theory]
        [MemberData(nameof(GetItemsCases))]
        public void GetItems_must_return_items(string completionFilter, List<bool> completionStatuses)
        {
            //arrange
            var itemManager = new Mock<IItemManager>();
            itemManager.Setup(im => im.GetItems(It.IsAny<int>(), It.IsAny<IEnumerable<bool>>()))
                .Returns(new List<ItemServiceModel>()
                {
                    new () 
                    {
                        Id=1, Description = "Task A", UserId = 123, ProjectId = 1, 
                        Done = true, Later = false 
                    },
                    new ()
                    {
                        Id=2, Description = "Task B", UserId = 123, ProjectId = 2,
                        Done = false, Later = true 
                    }
                });
            var sut = new ItemsController(itemManager.Object);
            sut.ControllerContext = new ControllerContext();
            sut.ControllerContext.HttpContext = new DefaultHttpContext();
            sut.HttpContext.Items["UserId"] = 123;
        
            //act
            var response = sut.GetItems(completionFilter);
        
            //assert
            itemManager.Verify(im => im.GetItems(123, completionStatuses), Times.Once);
            itemManager.VerifyNoOtherCalls();
            
            response.ShouldBeOfType<OkObjectResult>();
            var result = response as OkObjectResult;
            result?.StatusCode.ShouldBe((int)HttpStatusCode.OK);
            result?.Value.ShouldBe(new List<ItemServiceModel>()
            {
                new ()
                {
                    Id=1, Description = "Task A", UserId = 123, ProjectId = 1,
                    Done = true, Later = false
                },
                new ()
                {
                    Id=2, Description = "Task B", UserId = 123, ProjectId = 2,
                    Done = false, Later = true
                }
            });
        }
    }
}
