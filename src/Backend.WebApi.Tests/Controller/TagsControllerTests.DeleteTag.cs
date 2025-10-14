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
        TagsControllerTests
    {
        [Fact]
        public void DeleteTag_endpoint_config()
        {
            var method = Utils.GetMethod<TagsController>(nameof(TagsController.DeleteTag));
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
        public void DeleteTag_must_be_successful(int tagId, int userId)
        {
            //arrange
            var tagManager = new Mock<ITagManager>();
            var sut = new TagsController(tagManager.Object);
            sut.ControllerContext = new ControllerContext();
            sut.ControllerContext.HttpContext = new DefaultHttpContext();
            sut.ControllerContext.HttpContext.Items["UserId"] = userId;

            //act
            var response = sut.DeleteTag(tagId);
            
            //assert
            tagManager.Verify(pm => pm.DeleteTag(tagId, userId), Times.Once);
            tagManager.VerifyNoOtherCalls();
            response.ShouldBeOfType<OkResult>();
        }
        
        [Fact]
        public void DeleteTag_must_return_404_if_Tag_not_found()
        {
            //arrange
            var tagManager = new Mock<ITagManager>();
            tagManager.Setup(pm => pm.DeleteTag(123, 23))
                .Throws<TagNotFoundException>();
            var sut = new TagsController(tagManager.Object);
            sut.ControllerContext = new ControllerContext();
            sut.ControllerContext.HttpContext = new DefaultHttpContext();
            sut.ControllerContext.HttpContext.Items["UserId"] = 23;

            //act
            var response = sut.DeleteTag(123);
            
            //assert
            response.ShouldBeOfType<NotFoundResult>();
        }
        
        [Fact]
        public void DeleteTag_must_return_unauthorized_if_user_not_authorized()
        {
            //arrange
            var tagManager = new Mock<ITagManager>();
            tagManager.Setup(pm => pm.DeleteTag(123, 23))
                .Throws<UnauthorizedAccessException>();
            var sut = new TagsController(tagManager.Object);
            sut.ControllerContext = new ControllerContext();
            sut.ControllerContext.HttpContext = new DefaultHttpContext();
            sut.ControllerContext.HttpContext.Items["UserId"] = 23;

            //act
            var response = sut.DeleteTag(123);
            
            //assert
            response.ShouldBeOfType<UnauthorizedResult>();
        }
    }
}
