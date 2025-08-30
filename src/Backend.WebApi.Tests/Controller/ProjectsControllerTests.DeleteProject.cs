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
        [InlineData(12)]
        [InlineData(45)]
        public void DeleteProject_must_be_successful(int projectId)
        {
            //arrange
            var projectManager = new Mock<IProjectManager>();
            var sut = new ProjectsController(projectManager.Object);

            //act
            sut.DeleteProject(projectId);
            
            //assert
            projectManager.Verify(pm => pm.DeleteProject(projectId), Times.Once);
            projectManager.VerifyNoOtherCalls();
        }
    }
}
