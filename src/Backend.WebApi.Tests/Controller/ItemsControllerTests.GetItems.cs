using System.Net;
using System.Reflection;
using Backend.Core.Manager;
using Backend.Models;
using Backend.WebApi.ActionFilters;
using Backend.WebApi.Controllers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Shouldly;
using Swashbuckle.AspNetCore.SwaggerGen;

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
            
            var args = method.GetParameters();
            args.Length.ShouldBe(2);
            
            var completeArg = args[0];
            completeArg.Name.ShouldBe("complete");
            completeArg.ParameterType.ShouldBe(typeof(string));
            
            var isCompleteNullable = new NullabilityInfoContext().Create(completeArg).WriteState is NullabilityState.Nullable;
            isCompleteNullable.ShouldBeTrue();
            
            var laterArg = args[1];
            laterArg.Name.ShouldBe("later");
            laterArg.ParameterType.ShouldBe(typeof(string));
            
            var isLaterNullable = new NullabilityInfoContext().Create(laterArg).WriteState is NullabilityState.Nullable;
            isLaterNullable.ShouldBeTrue();
        }

        public static IEnumerable<object[]> GetItemsCases =
        [
            (object[])[
                (string?)null, new List<bool>(),
                (string?)null, new List<bool>()
            ],
            [ 
                "", new List<bool>(),
                (string?)null, new List<bool>()
            ],
            [ 
                "completed,uncompleted", new List<bool>{ true, false },
                (string?)null, new List<bool>()
            ],
            [ 
                "uncompleted,completed", new List<bool>{ false, true },
                (string?)null, new List<bool>()
            ],
            [ 
                "completed", new List<bool>{ true },
                (string?)null, new List<bool>()
            ],
            [ 
                "uncompleted", new List<bool>{ false },
                (string?)null, new List<bool>()
            ],
            (object[])[
                (string?)null, new List<bool>(),
                "later", new List<bool>{true}
            ],
            (object[])[
                (string?)null, new List<bool>(),
                "now", new List<bool>{false}
            ],
            (object[])[
                (string?)null, new List<bool>(),
                "later,now", new List<bool>{true, false}
            ],
            (object[])[
                (string?)null, new List<bool>(),
                "now,later", new List<bool>{false,true}
            ],
        ];
        [Theory]
        [MemberData(nameof(GetItemsCases))]
        public void GetItems_must_return_items(
            string completionFilter, 
            List<bool> completionStatuses,
            string? laterFilter,
            List<bool> laterStatuses
            )
        {
            //arrange
            var itemManager = new Mock<IItemManager>();
            itemManager.Setup(im => im.GetItems(It.IsAny<int>(), 
                    It.IsAny<IEnumerable<bool>>(),
                    It.IsAny<IEnumerable<bool>>()))
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
            var response = sut.GetItems(completionFilter, laterFilter);
        
            //assert
            itemManager.Verify(im => im.GetItems(123, completionStatuses, laterStatuses), Times.Once);
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
