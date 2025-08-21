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
        public void GetProject_endpoint_config()
        {
            var method = Utils.GetMethod<ProjectsController>(nameof(ProjectsController.GetProjects));
            method.ShouldNotBeNull();

            var attributes = method?.GetCustomAttributes(typeof(HttpGetAttribute), true);
            attributes.Length.ShouldBeGreaterThan(0, "Must have HttpGET attribute");

            var getAttr = attributes[0] as HttpGetAttribute;
            getAttr.Template.ShouldBe("[action]");
        
            attributes = method?.GetCustomAttributes(typeof(ServiceFilterAttribute<SecurityFilterAttribute>), true);
            attributes.Length.ShouldBeGreaterThan(0, "Must require authorization");
        }
    }
}
