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
    public partial class ProjectsControllerTests
    {
        [Fact]
        public void GetProjects_endpoint_config()
        {
            var method = Utils.GetMethod<ProjectsController>(nameof(ProjectsController.GetProjects));
            method.ShouldNotBeNull();

            var attributes = method?.GetCustomAttributes(typeof(HttpGetAttribute), true);
            attributes.Length.ShouldBeGreaterThan(0, "Must have HttpGET attribute");

            var getAttr = attributes[0] as HttpGetAttribute;
            getAttr.Template.ShouldBe("[action]");
        
            attributes = method?.GetCustomAttributes(typeof(ServiceFilterAttribute<SecurityFilterAttribute>), true);
            attributes.Length.ShouldBeGreaterThan(0, "Must require authorization");
            
            var args = method.GetParameters();
            args.Length.ShouldBe(2);
            
            var completeArg = args[0];
            completeArg.Name.ShouldBe("complete");
            completeArg.ParameterType.ShouldBe(typeof(string));
            Utils.ShouldBeNullable(completeArg);
            
            var laterArg = args[1];
            laterArg.Name.ShouldBe("later");
            laterArg.ParameterType.ShouldBe(typeof(string));
            Utils.ShouldBeNullable(laterArg);
        }

        [Theory, CombinatorialData]
        public void GetProjects_must_be_successful(
            [CombinatorialValues(1,2)]
            int userId,
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
            string? laterFilter
            )
        {
            //arrange
            var manager = new Mock<IProjectManager>();
            
            IEnumerable<bool>? completionStatuses;
            if (completionFilter == null)
            {
                completionStatuses = null;
            }else
            if (completionFilter == "")
            {
                completionStatuses = [];
            }
            else
            {
                completionStatuses = completionFilter.Split(",").Select(s => s == "completed");
            }
            
            IEnumerable<bool>? laterStatuses;
            if (laterFilter == null)
            {
                laterStatuses = null;
            }else
            if (laterFilter == "")
            {
                laterStatuses = [];
            }
            else
            {
                laterStatuses = laterFilter.Split(",").Select(s => s == "later");
            }
            
            
            manager.Setup(pm => pm.GetProjects(userId, completionStatuses, laterStatuses))
                .Returns(new List<ProjectServiceModel>()
                {
                    new() { Id = 1, Name = "Project A", Later = false },
                    new() { Id = 2, Name = "Project B", Later = true }
                });
            var sut = new ProjectsController(manager.Object);
            sut.ControllerContext = new ControllerContext();
            sut.ControllerContext.HttpContext = new DefaultHttpContext();
            sut.ControllerContext.HttpContext.Items["UserId"] = userId;
            
            //act
            var response = sut.GetProjects(completionFilter, laterFilter);
            
            //assert
            response.ShouldBeOfType<OkObjectResult>();
            var okObjectResult = response as OkObjectResult;
            okObjectResult.ShouldNotBeNull();
            okObjectResult?.StatusCode.ShouldBe((int)HttpStatusCode.OK);
            okObjectResult?.Value.ShouldNotBeNull();
            okObjectResult?.Value?.GetType()
                .IsAssignableTo(typeof(IEnumerable<ProjectServiceModel>))
                .ShouldBeTrue();
            
            okObjectResult?.Value.ShouldBe(new List<ProjectServiceModel>()
            {
                new() { Id = 1, Name = "Project A", Later = false, },
                new() { Id = 2, Name = "Project B", Later = true }
            });
        }
    }
}
