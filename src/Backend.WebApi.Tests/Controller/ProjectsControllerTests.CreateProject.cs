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
        public void CreateProject_endpoint_config()
        {
            var method = Utils.GetMethod<ProjectsController>(nameof(ProjectsController.CreateProject));
            method.ShouldNotBeNull();

            var attributes = method?.GetCustomAttributes(typeof(HttpPostAttribute), true);
            attributes.Length.ShouldBeGreaterThan(0, "Must have HttpPOST attribute");

            var postAttr = attributes[0] as HttpPostAttribute;
            postAttr.Template.ShouldBe("[action]");
        
            attributes = method?.GetCustomAttributes(typeof(ServiceFilterAttribute<SecurityFilterAttribute>), true);
            attributes.Length.ShouldBeGreaterThan(0, "Must require authorization");
        }
        
        [Theory]
        [InlineData(256, 123)]
        [InlineData(457, 224)]
        public void Project_must_be_created(int expectedProjectId, int userId)
        {
            //arrange
            var projectManager = new Mock<IProjectManager>();
            projectManager.Setup(im => im.CreateProject(It.IsAny<Project>()))
                .Returns(expectedProjectId);
            var sut = new ProjectsController(projectManager.Object);
            sut.ControllerContext = new ControllerContext();
            sut.ControllerContext.HttpContext = new DefaultHttpContext();
            sut.HttpContext.Items["UserId"] = userId;
        
            //act
            var project = new Project
            {
                Description = "Foo"
            };
            var response = sut.CreateProject(project);
        
            //assert
            var verifyProject = (Project p) =>
            {
                p.Description.ShouldBe("Foo");
                p.UserId.ShouldBe(userId);
                return true;
            };
            projectManager.Verify(im => im.CreateProject(It.Is<Project>(p => verifyProject(p))), Times.Once);
            projectManager.VerifyNoOtherCalls();
            
            response.ShouldBeOfType<OkObjectResult>();
            var result = response as OkObjectResult;
            result?.StatusCode.ShouldBe((int)HttpStatusCode.OK);
            result?.Value.ShouldBe(expectedProjectId);
        }
    }
}
