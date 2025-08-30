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
    public partial class 
        ProjectsControllerTests
    {
        [Fact]
        public void DeleteProject_endpoint_config()
        {
            var method = Utils.GetMethod<ProjectsController>(nameof(ProjectsController.DeleteProject));
            method.ShouldNotBeNull();

            var attributes = method?.GetCustomAttributes(typeof(HttpDeleteAttribute), true);
            attributes.Length.ShouldBeGreaterThan(0, "Must have HttpDelete attribute");

            var deleteAttr = attributes[0] as HttpDeleteAttribute;
            deleteAttr.Template.ShouldBe("[action]");
        
            attributes = method?.GetCustomAttributes(typeof(ServiceFilterAttribute<SecurityFilterAttribute>), true);
            attributes.Length.ShouldBeGreaterThan(0, "Must require authorization");
            
            var idParam = method?.GetParameters()[0];
            idParam.Name.ShouldBe("id");
            idParam.GetCustomAttributes(typeof(FromQueryAttribute), true).ShouldNotBeEmpty();
        }

        [Theory]
        [InlineData(12, 22)]
        [InlineData(45, 23)]
        public void DeleteProject_must_be_successful(int projectId, int userId)
        {
            //arrange
            var projectManager = new Mock<IProjectManager>();
            var sut = new ProjectsController(projectManager.Object);
            sut.ControllerContext = new ControllerContext();
            sut.ControllerContext.HttpContext = new DefaultHttpContext();
            sut.ControllerContext.HttpContext.Items["UserId"] = userId;

            //act
            var response = sut.DeleteProject(projectId);
            
            //assert
            projectManager.Verify(pm => pm.DeleteProject(projectId, userId), Times.Once);
            projectManager.VerifyNoOtherCalls();
            response.ShouldBeOfType<OkResult>();
        }
        
        [Fact]
        public void DeleteProject_must_return_404_if_project_not_found()
        {
            //arrange
            var projectManager = new Mock<IProjectManager>();
            projectManager.Setup(pm => pm.DeleteProject(123, 23))
                .Throws<ProjectNotFoundException>();
            var sut = new ProjectsController(projectManager.Object);
            sut.ControllerContext = new ControllerContext();
            sut.ControllerContext.HttpContext = new DefaultHttpContext();
            sut.ControllerContext.HttpContext.Items["UserId"] = 23;

            //act
            var response = sut.DeleteProject(123);
            
            //assert
            response.ShouldBeOfType<NotFoundResult>();
        }
        
        [Fact]
        public void DeleteProject_must_return_unauthorized_if_user_not_authorized()
        {
            //arrange
            var projectManager = new Mock<IProjectManager>();
            projectManager.Setup(pm => pm.DeleteProject(123, 23))
                .Throws<UnauthorizedAccessException>();
            var sut = new ProjectsController(projectManager.Object);
            sut.ControllerContext = new ControllerContext();
            sut.ControllerContext.HttpContext = new DefaultHttpContext();
            sut.ControllerContext.HttpContext.Items["UserId"] = 23;

            //act
            var response = sut.DeleteProject(123);
            
            //assert
            response.ShouldBeOfType<UnauthorizedResult>();
        }
    }
}
