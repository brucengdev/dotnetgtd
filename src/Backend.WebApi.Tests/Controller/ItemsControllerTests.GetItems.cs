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
    public class GetItemTestCase
    {
        public string? Complete;
        public string? Later;
        public IEnumerable<bool> CompletionStatuses;
        public IEnumerable<bool> LaterStatuses;
        public int? ProjectId;

        public object[] ToObjectArray()
        {
            return
            [
                Complete, CompletionStatuses,
                Later, LaterStatuses,
                ProjectId
            ];
        }
    }
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
            args.Length.ShouldBe(3);
            
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
            
            var projectIdArg = args[2];
            projectIdArg.Name.ShouldBe("projectId");
            projectIdArg.ParameterType.ShouldBe(typeof(int?));
        }

        public static IEnumerable<object[]> GetItemsCases = (new List<GetItemTestCase>
        {
            new()
            {
                Complete = null, CompletionStatuses = new List<bool>(),
                Later = null, LaterStatuses = new List<bool>()
            },
            new()
            {
                Complete = "", CompletionStatuses = new List<bool>(),
                Later = null, LaterStatuses = new List<bool>()
            },
            new()
            {
                Complete = "completed,uncompleted", CompletionStatuses = new List<bool> { true, false },
                Later = null, LaterStatuses = new List<bool>()
            },
            new()
            {
                Complete = "uncompleted,completed", CompletionStatuses = new List<bool> { false, true },
                Later = null, LaterStatuses = new List<bool>()
            },
            new()
            {
                Complete = "completed", CompletionStatuses = new List<bool> { true },
                Later = null, LaterStatuses = new List<bool>()
            },

            new()
            {
                Complete = "uncompleted", CompletionStatuses = new List<bool> { false },
                Later = null, LaterStatuses = new List<bool>()
            },

            new()
            {
                Complete = null, CompletionStatuses = new List<bool>(),
                Later = "later", LaterStatuses = new List<bool> { true }
            },
            new()
            {
                Complete = null, CompletionStatuses = new List<bool>(),
                Later = "now", LaterStatuses = new List<bool> { false }
            },
            new ()
            {
                Complete = null, CompletionStatuses = new List<bool>(),
                Later = "later,now", LaterStatuses = new List<bool> { true, false }
            },
            new()
            {
                Complete = null, CompletionStatuses = new List<bool>(),
                Later = "now,later", LaterStatuses = new List<bool> { false, true }
            },
            new()
            {
                Complete = "completed,uncompleted", CompletionStatuses = new List<bool> { true, false },
                Later = "now,later", LaterStatuses = new List<bool> { false, true }
            },
            new()
            {
                Complete = null, CompletionStatuses = [],
                Later = null, LaterStatuses = [],
                ProjectId = 12
            }
        }).Select(testCase => testCase.ToObjectArray());
        
        [Theory]
        [MemberData(nameof(GetItemsCases))]
        public void GetItems_must_return_items(
            string completionFilter, 
            IEnumerable<bool> completionStatuses,
            string? laterFilter,
            IEnumerable<bool> laterStatuses,
            int? projectId
            )
        {
            //arrange
            var itemManager = new Mock<IItemManager>();
            itemManager.Setup(im => im.GetItems(It.IsAny<int>(), 
                    It.IsAny<IEnumerable<bool>>(),
                    It.IsAny<IEnumerable<bool>>(),
                    It.IsAny<int?>()))
                .Returns(new List<ItemServiceModel>
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
            var response = sut.GetItems(completionFilter, laterFilter, projectId);
        
            //assert
            itemManager.Verify(im => im.GetItems(123, completionStatuses, laterStatuses, projectId), Times.Once);
            itemManager.VerifyNoOtherCalls();
            
            response.ShouldBeOfType<OkObjectResult>();
            var result = response as OkObjectResult;
            result?.StatusCode.ShouldBe((int)HttpStatusCode.OK);
            result?.Value.ShouldBe(new List<ItemServiceModel>
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
