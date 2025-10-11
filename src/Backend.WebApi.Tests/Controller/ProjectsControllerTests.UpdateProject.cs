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
        public void UpdateProject_endpoint_config()
        {
            var method = Utils.GetMethod<ProjectsController>(nameof(ProjectsController.UpdateProject));
            method.ShouldNotBeNull();

            var attributes = method?.GetCustomAttributes(typeof(HttpPutAttribute), true);
            attributes.Length.ShouldBeGreaterThan(0, "Must have HttpPUT attribute");

            var putAttr = attributes[0] as HttpPutAttribute;
            putAttr.Template.ShouldBe("[action]");
        
            attributes = method?.GetCustomAttributes(typeof(ServiceFilterAttribute<SecurityFilterAttribute>), true);
            attributes.Length.ShouldBeGreaterThan(0, "Must require authorization");
        }

        [Theory]
        [InlineData(12)]
        [InlineData(25)]
        public void UpdateProject_must_be_successful(int userId)
        {
            //arrange
            var projectManager = new Mock<IProjectManager>();
            var sut = new ProjectsController(projectManager.Object);
            sut.ControllerContext = new ControllerContext();
            sut.ControllerContext.HttpContext = new DefaultHttpContext();
            sut.ControllerContext.HttpContext.Items["UserId"] = userId.ToString();
            
            //act
            var project = new Project()
            {
                Id = 1,
                Done = false,
                Later = false,
                Name = "Updated project",
                UserId = userId
            };
            var result = sut.UpdateProject(project);
            
            //assert
            result.ShouldBeOfType<OkResult>();
            projectManager.Verify(pm => pm.UpdateProject(project, userId), Times.Exactly(1));
            projectManager.VerifyNoOtherCalls();
        }
        
        [Theory]
        [InlineData(12)]
        [InlineData(25)]
        public void UpdateProject_must_return_unauthorized_if_user_does_not_own_project(int userId)
        {
            //arrange
            var projectManager = new Mock<IProjectManager>();
            var project = new Project()
            {
                Id = 1,
                Done = false,
                Later = false,
                Name = "Updated project",
                UserId = 12
            };
            projectManager.Setup(pm => pm.UpdateProject(project, userId))
                .Throws(new UnauthorizedAccessException());
            var sut = new ProjectsController(projectManager.Object);
            sut.ControllerContext = new ControllerContext();
            sut.ControllerContext.HttpContext = new DefaultHttpContext();
            sut.ControllerContext.HttpContext.Items["UserId"] = userId.ToString();
            
            //act
            var result = sut.UpdateProject(project);
            
            //assert
            result.ShouldBeOfType<UnauthorizedResult>();
            projectManager.Verify(pm => pm.UpdateProject(project, userId), Times.Exactly(1));
            projectManager.VerifyNoOtherCalls();
        }
        
        [Fact]
        public void UpdateProject_must_return_404_if_project_is_not_found()
        {
            //arrange
            var projectManager = new Mock<IProjectManager>();
            var project = new Project()
            {
                Id = 1,
                Done = false,
                Later = false,
                Name = "Updated project",
                UserId = 12
            };
            projectManager.Setup(pm => pm.UpdateProject(project, 12))
                .Throws(new ProjectNotFoundException());
            var sut = new ProjectsController(projectManager.Object);
            sut.ControllerContext = new ControllerContext();
            sut.ControllerContext.HttpContext = new DefaultHttpContext();
            sut.ControllerContext.HttpContext.Items["UserId"] = 12;
            
            //act
            var result = sut.UpdateProject(project);
            
            //assert
            result.ShouldBeOfType<NotFoundResult>();
            projectManager.Verify(pm => pm.UpdateProject(project, 12), Times.Exactly(1));
            projectManager.VerifyNoOtherCalls();
        }
    }
}
