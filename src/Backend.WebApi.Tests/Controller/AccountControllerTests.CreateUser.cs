using Backend.WebApi.Controllers;
using Backend.Core.Manager;
using Backend.WebApi.ActionFilters;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Shouldly;

namespace Backend.WebApi.Tests.Controller;

public partial class AccountControllerTests
{
    [Fact]
    public void CreateUser_must_success()
    {
        //arrange
        var accountManager = new Mock<IAccountManager>();
        accountManager.Setup(am => am.CreateUser(It.IsAny<string>(), It.IsAny<string>()))
            .Returns(CreateUserResult.Success);
        var sut = new AccountController(accountManager.Object);
        sut.ControllerContext = new();
        sut.ControllerContext.HttpContext = new DefaultHttpContext();
        sut.ControllerContext.HttpContext.Items["UserId"] = 1;
        
        //act
        ActionResult<bool> result = sut.CreateUser("johndoe", "testpass");
        
        //assert
        accountManager.Verify(am => am.CreateUser("johndoe", "testpass"), Times.Exactly(1));
        accountManager.VerifyNoOtherCalls();
        result.Result.ShouldBeOfType<OkResult>();
    }
    
    [Fact]
    public void CreateUser_must_fail_when_user_already_exists()
    {
        //arrange
        var accountManager = new Mock<IAccountManager>();
        accountManager.Setup(am => am.CreateUser(It.IsAny<string>(), It.IsAny<string>()))
            .Returns(CreateUserResult.AlreadyExists);
        var sut = new AccountController(accountManager.Object);
        sut.ControllerContext = new();
        sut.ControllerContext.HttpContext = new DefaultHttpContext();
        sut.ControllerContext.HttpContext.Items["UserId"] = 1;
        
        //act
        ActionResult<bool> result = sut.CreateUser("johndoe", "testpass");
        
        //assert
        accountManager.Verify(am => am.CreateUser("johndoe", "testpass"), Times.Exactly(1));
        accountManager.VerifyNoOtherCalls();
        result.Result.ShouldBeOfType<ForbidResult>();
    }
    
    [Theory]
    [InlineData(2)]
    [InlineData(245)]
    [InlineData(12)]
    public void Only_admin_user_can_create_new_users(int loggedInUserId)
    {
        //arrange
        var accountManager = new Mock<IAccountManager>();
        accountManager.Setup(am => am.CreateUser(It.IsAny<string>(), It.IsAny<string>()))
            .Returns(CreateUserResult.Success);
        var sut = new AccountController(accountManager.Object);
        sut.ControllerContext = new();
        sut.ControllerContext.HttpContext = new DefaultHttpContext();
        sut.ControllerContext.HttpContext.Items["UserId"] = loggedInUserId;
        
        //act
        var result = sut.CreateUser("johndoe", "testpass");
        
        //assert
        accountManager.VerifyNoOtherCalls();
        result.Result.ShouldBeOfType<UnauthorizedResult>();
    }

    [Fact]
    public void CreateUser_endpoint_config()
    {
        var method = Utils.GetMethod<AccountController>(nameof(AccountController.CreateUser));
        method.ShouldNotBeNull();

        var attributes = method?.GetCustomAttributes(typeof(HttpPostAttribute), true);
        attributes.Length.ShouldBeGreaterThan(0);

        var postAttr = attributes[0] as HttpPostAttribute;
        postAttr.Template.ShouldBe("[action]");
        
        var secAttrs = method?.GetCustomAttributes(typeof(ServiceFilterAttribute<SecurityFilterAttribute>), true);
        secAttrs.Length.ShouldBeGreaterThan(0, "Must require authorization");
    }
}
