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
        public void UpdateTag_endpoint_config()
        {
            var method = Utils.GetMethod<TagsController>(nameof(TagsController.UpdateTag));
            method.ShouldNotBeNull();

            var attributes = method?.GetCustomAttributes(typeof(HttpPutAttribute), true);
            attributes.Length.ShouldBeGreaterThan(0, "Must have HttpPUT attribute");

            var postAttr = attributes[0] as HttpPutAttribute;
            postAttr.Template.ShouldBe("[action]");
        
            attributes = method?.GetCustomAttributes(typeof(ServiceFilterAttribute<SecurityFilterAttribute>), true);
            attributes.Length.ShouldBeGreaterThan(0, "Must require authorization");
        }

        [Theory]
        [InlineData(1)]
        [InlineData(2)]
        [InlineData(3)]
        public void UpdateTag_must_be_successful(int userId)
        {
            //arrange
            var tagManager = new Mock<ITagManager>();
            var sut = new TagsController(tagManager.Object);
            sut.ControllerContext = new();
            sut.ControllerContext.HttpContext = new DefaultHttpContext();
            sut.ControllerContext.HttpContext.Items["UserId"] = userId;
            
            //act
            var inputTag = new Tag()
            {
                Id = 1,
                Name = "tag a updated",
                UserId = userId
            };
            var result = sut.UpdateTag(inputTag);
            
            //assert
            tagManager.Verify(tm => tm.UpdateTag(inputTag, userId), Times.Exactly(1));
            tagManager.VerifyNoOtherCalls();
            result.ShouldBeOfType<OkResult>();
        }
        
        [Fact]
        public void UpdateTag_must_return_400_if_user_is_not_found()
        {
            //arrange
            int userId = 23;
            var inputTag = new Tag()
            {
                Id = 1,
                Name = "tag a updated",
                UserId = userId
            };
            var tagManager = new Mock<ITagManager>();
            tagManager.Setup(tm => tm.UpdateTag(inputTag, userId))
                .Throws(new UserNotFoundException());
            var sut = new TagsController(tagManager.Object);
            sut.ControllerContext = new();
            sut.ControllerContext.HttpContext = new DefaultHttpContext();
            sut.ControllerContext.HttpContext.Items["UserId"] = userId;
            
            //act
            var result = sut.UpdateTag(inputTag);
            
            //assert
            tagManager.Verify(tm => tm.UpdateTag(inputTag, userId), Times.Exactly(1));
            tagManager.VerifyNoOtherCalls();
            result.ShouldBeOfType<BadRequestResult>();
        }
        
        [Fact]
        public void UpdateTag_must_return_404_if_tag_is_not_found()
        {
            //arrange
            int userId = 23;
            var inputTag = new Tag()
            {
                Id = 1,
                Name = "tag a updated",
                UserId = userId
            };
            var tagManager = new Mock<ITagManager>();
            tagManager.Setup(tm => tm.UpdateTag(inputTag, userId))
                .Throws(new TagNotFoundException());
            var sut = new TagsController(tagManager.Object);
            sut.ControllerContext = new();
            sut.ControllerContext.HttpContext = new DefaultHttpContext();
            sut.ControllerContext.HttpContext.Items["UserId"] = userId;
            
            //act
            var result = sut.UpdateTag(inputTag);
            
            //assert
            tagManager.Verify(tm => tm.UpdateTag(inputTag, userId), Times.Exactly(1));
            tagManager.VerifyNoOtherCalls();
            result.ShouldBeOfType<NotFoundResult>();
        }
    }
}
