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
    public partial class TagsControllerTests
    {
        [Fact]
        public void GetTags_endpoint_config()
        {
            var method = Utils.GetMethod<TagsController>(nameof(TagsController.GetTags));
            method.ShouldNotBeNull();

            var attributes = method?.GetCustomAttributes(typeof(HttpGetAttribute), true);
            attributes.Length.ShouldBeGreaterThan(0, "Must have HttpGET attribute");

            var getAttr = attributes[0] as HttpGetAttribute;
            getAttr.Template.ShouldBe("[action]");
        
            attributes = method?.GetCustomAttributes(typeof(ServiceFilterAttribute<SecurityFilterAttribute>), true);
            attributes.Length.ShouldBeGreaterThan(0, "Must require authorization");
        }

        [Theory]
        [InlineData(12)]
        [InlineData(44)]
        public void GetTags_must_be_successful(int userId)
        {
            //arrange
            var manager = new Mock<ITagManager>();
            manager.Setup(pm => pm.GetTags(userId))
                .Returns(new List<Tag>()
                {
                    new() { Id = 1, Name = "Tag A", UserId = userId },
                    new() { Id = 2, Name = "Tag B", UserId = userId }
                });
            var sut = new TagsController(manager.Object);
            sut.ControllerContext = new ControllerContext();
            sut.ControllerContext.HttpContext = new DefaultHttpContext();
            sut.ControllerContext.HttpContext.Items["UserId"] = userId;
            
            //act
            var response = sut.GetTags();
            
            //assert
            response.ShouldBeOfType<OkObjectResult>();
            var okObjectResult = response as OkObjectResult;
            okObjectResult.ShouldNotBeNull();
            okObjectResult?.StatusCode.ShouldBe((int)HttpStatusCode.OK);
            okObjectResult?.Value.ShouldNotBeNull();
            okObjectResult?.Value?.GetType().IsAssignableTo(typeof(IEnumerable<Tag>)).ShouldBeTrue();
            
            okObjectResult?.Value.ShouldBe(new List<Tag>()
            {
                new() { Id = 1, Name = "Tag A", UserId = userId },
                new() { Id = 2, Name = "Tag B", UserId = userId }
            });
        }
    }
}
