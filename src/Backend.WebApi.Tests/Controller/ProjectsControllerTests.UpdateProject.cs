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
    }
}
