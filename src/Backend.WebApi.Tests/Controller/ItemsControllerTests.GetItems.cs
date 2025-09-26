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

        [Fact]
        public void GetItems_must_return_all_tasks_that_have_project()
        {
            TestGetItems(
                completionFilter: null,
                laterFilter: null,
                projectId: "nonnull",
                tagFilter: null,
                completionStatuses: [true, false],
                laterStatuses: [true, false],
                projectIds: null,
                tasksWithNoProject: false,
                tagIds: null);
        }
        
        [Fact]
        public void GetItems_must_return_all_tasks_that_dont_have_project()
        {
            TestGetItems(
                completionFilter: null,
                laterFilter: null,
                projectId: "null",
                tagFilter: null,
                completionStatuses: [true, false],
                laterStatuses: [true, false],
                projectIds: [],
                tasksWithNoProject: true,
                tagIds: null);
        }
        
        [Fact]
        public void GetItems_must_return_tasks_in_selected_project_list()
        {
            TestGetItems(
                completionFilter: null,
                laterFilter: null,
                projectId: "1,null,2",
                tagFilter: null,
                completionStatuses: [true, false],
                laterStatuses: [true, false],
                projectIds: [1,2],
                tasksWithNoProject: true,
                tagIds: null);
        }
        
        [Fact]
        public void GetItems_must_return_tasks_from_all_projects_if_non_null_is_specified()
        {
            TestGetItems(
                completionFilter: null,
                laterFilter: null,
                projectId: "1,2,nonnull",
                tagFilter: null,
                completionStatuses: [true, false],
                laterStatuses: [true, false],
                projectIds: null,
                tasksWithNoProject: false,
                tagIds: null);
        }
        
        [Fact]
        public void GetItems_must_return_all_tasks_if_both_null_and_nonnull_is_specified()
        {
            TestGetItems(
                completionFilter: null,
                laterFilter: null,
                projectId: "1,null,2,nonnull",
                tagFilter: null,
                completionStatuses: [true, false],
                laterStatuses: [true, false],
                projectIds: null,
                tasksWithNoProject: true,
                tagIds: null);
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
            [CombinatorialValues(null, "", "2,3,null", "nonnull", "*")]
                string? tagFilter
            )
        {
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
                tagIds = tagFilter.Split(",")
                    .Where(t => t != "null" && t != "nonnull")
                    .Select(t => Convert.ToInt32(t));
            }

            TestGetItems(completionFilter, laterFilter, projectId, tagFilter, 
                completionStatuses, laterStatuses, 
                projectIds, tasksWithNoProject,
                tagIds);
        }

        private static void TestGetItems(
            string? completionFilter, 
            string? laterFilter, 
            string? projectId, 
            string? tagFilter,
            IEnumerable<bool> completionStatuses, 
            IEnumerable<bool> laterStatuses, 
            IEnumerable<int>? projectIds, 
            bool tasksWithNoProject,
            IEnumerable<int>? tagIds)
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
            itemManager.Verify(im => im.GetItems(123, 
                completionStatuses, laterStatuses, 
                projectIds,
                tasksWithNoProject,
                tagIds), Times.Once);
            itemManager.VerifyNoOtherCalls();
            
            response.ShouldBeOfType<OkObjectResult>();
            var result = response as OkObjectResult;
            result?.StatusCode?.ShouldBe<int>((int)HttpStatusCode.OK);
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
