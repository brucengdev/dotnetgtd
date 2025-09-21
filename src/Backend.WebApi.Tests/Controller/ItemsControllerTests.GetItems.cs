using System.Net;
using Backend.Core.Manager;
using Backend.Models;
using Backend.WebApi.ActionFilters;
using Backend.WebApi.Controllers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
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
            
            var args = method.GetParameters();
            args.Length.ShouldBe(4);
            
            var completeArg = args[0];
            completeArg.Name.ShouldBe("complete");
            completeArg.ParameterType.ShouldBe(typeof(string));
            Utils.ShouldBeNullable(completeArg);
            
            var laterArg = args[1];
            laterArg.Name.ShouldBe("later");
            laterArg.ParameterType.ShouldBe(typeof(string));
            Utils.ShouldBeNullable(laterArg);
            
            var projectIdArg = args[2];
            projectIdArg.Name.ShouldBe("projectId");
            projectIdArg.ParameterType.ShouldBe(typeof(string));
            
            var tagIdsArg = args[3];
            tagIdsArg.Name.ShouldBe("tagIds");
            tagIdsArg.ParameterType.ShouldBe(typeof(string));
            Utils.ShouldBeNullable(tagIdsArg);
        }
        
        [Theory, CombinatorialData]
        public void GetItems_must_return_items(
            [CombinatorialValues("completed", "uncompleted",
                "completed,uncompleted", 
                "uncompleted,completed", 
                "", 
                null)] 
                string completionFilter, 
            [CombinatorialValues("later", "now", 
                "later,now", 
                "now,later", 
                "", null)] 
                string? laterFilter,
            [CombinatorialValues("1", "2", "3", "2,3", "nonnull", "2,null", "*","", null)]
                string? projectId,
            [CombinatorialValues(null, "", "12,22", "2,3,4", "*")]
                string? tagFilter
            )
        {
            //arrange
            var itemManager = new Mock<IItemManager>();
            itemManager.Setup(im => im.GetItems(It.IsAny<int>(), 
                    It.IsAny<IEnumerable<bool>>(),
                    It.IsAny<IEnumerable<bool>>(),
                    It.IsAny<IEnumerable<int>?>(),
                    It.IsAny<bool>(),
                    It.IsAny<IEnumerable<int>?>()))
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
            var response = sut.GetItems(completionFilter, laterFilter, projectId, tagFilter);
        
            //assert
            IEnumerable<bool> completionStatuses;
            if (completionFilter == null || completionFilter == "*")
            {
                completionStatuses = [true, false];
            }else if (completionFilter == "")
            {
                completionStatuses = [];
            }
            else 
            {
                completionStatuses = completionFilter.Split(",").Select(f => f == "completed");
            }
            IEnumerable<bool> laterStatuses = [];
            if (laterFilter == null || laterFilter == "*")
            {
                laterStatuses = [true, false];
            } else if (laterFilter == "")
            {
                laterStatuses = [];
            } else
            {
                laterStatuses = laterFilter.Split(",").Select(f => f == "later");
            }

            IEnumerable<int>? projectIds;
            bool tasksWithNoProject = false;
            if (projectId == null || projectId == "*")
            {
                projectIds = null;
                tasksWithNoProject = true;
            } else if (projectId == "")
            {
                projectIds = [];
                tasksWithNoProject = false;
            }
            else
            {
                var tokens = projectId.Split(",");
                projectIds = tokens
                    .Where(v => v != "nonnull" && v != "null")
                    .Select(v => Convert.ToInt32(v))
                    .ToList();
                if (tokens.Contains("nonnull"))
                {
                    projectIds = null;
                }
                if (tokens.Contains("null"))
                {
                    tasksWithNoProject = true;
                }
            }

            IEnumerable<int>? tagIds;
            if (tagFilter == null || tagFilter == "*")
            {
                tagIds = null;
            } else if (tagFilter == "")
            {
                tagIds = [];
            }
            else
            {
                tagIds = tagFilter.Split(",").Select(t => Convert.ToInt32(t));
            }
            
            itemManager.Verify(im => im.GetItems(123, 
                completionStatuses, laterStatuses, 
                projectIds,
                tasksWithNoProject,
                tagIds), Times.Once);
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
