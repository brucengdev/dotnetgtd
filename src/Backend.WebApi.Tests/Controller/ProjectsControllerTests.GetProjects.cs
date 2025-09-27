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

        [Theory]
        [InlineData(12)]
        [InlineData(44)]
        public void GetProjects_must_be_successful(int userId)
        {
            //arrange
            var manager = new Mock<IProjectManager>();
            manager.Setup(pm => pm.GetProjects(userId))
                .Returns(new List<Project>()
                {
                    new() { Id = 1, Name = "Project A", UserId = userId, Later = false },
                    new() { Id = 2, Name = "Project B", UserId = userId, Later = true }
                });
            var sut = new ProjectsController(manager.Object);
            sut.ControllerContext = new ControllerContext();
            sut.ControllerContext.HttpContext = new DefaultHttpContext();
            sut.ControllerContext.HttpContext.Items["UserId"] = userId;
            
            //act
            var response = sut.GetProjects(null, null);
            
            //assert
            response.ShouldBeOfType<OkObjectResult>();
            var okObjectResult = response as OkObjectResult;
            okObjectResult.ShouldNotBeNull();
            okObjectResult?.StatusCode.ShouldBe((int)HttpStatusCode.OK);
            okObjectResult?.Value.ShouldNotBeNull();
            okObjectResult?.Value?.GetType().IsAssignableTo(typeof(IEnumerable<Project>)).ShouldBeTrue();
            
            okObjectResult?.Value.ShouldBe(new List<Project>()
            {
                new() { Id = 1, Name = "Project A", UserId = userId, Later = false, },
                new() { Id = 2, Name = "Project B", UserId = userId, Later = true }
            });
        }
    }
}
