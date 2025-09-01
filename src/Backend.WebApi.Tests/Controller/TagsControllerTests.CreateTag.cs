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
        public void CreateTag_endpoint_config()
        {
            var method = Utils.GetMethod<TagsController>(nameof(TagsController.CreateTag));
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
        public void Tag_must_be_created(int expectedTagId, int userId)
        {
            //arrange
            var TagManager = new Mock<ITagManager>();
            TagManager.Setup(im => im.CreateTag(It.IsAny<Tag>()))
                .Returns(expectedTagId);
            var sut = new TagsController(TagManager.Object);
            sut.ControllerContext = new ControllerContext();
            sut.ControllerContext.HttpContext = new DefaultHttpContext();
            sut.HttpContext.Items["UserId"] = userId;
        
            //act
            var Tag = new Tag
            {
                Name = "Foo"
            };
            var response = sut.CreateTag(Tag);
        
            //assert
            var verifyTag = (Tag p) =>
            {
                p.Name.ShouldBe("Foo");
                p.UserId.ShouldBe(userId);
                return true;
            };
            TagManager.Verify(im => im.CreateTag(It.Is<Tag>(p => verifyTag(p))), Times.Once);
            TagManager.VerifyNoOtherCalls();
            
            response.ShouldBeOfType<OkObjectResult>();
            var result = response as OkObjectResult;
            result?.StatusCode.ShouldBe((int)HttpStatusCode.OK);
            result?.Value.ShouldBe(expectedTagId);
        }
    }
}
