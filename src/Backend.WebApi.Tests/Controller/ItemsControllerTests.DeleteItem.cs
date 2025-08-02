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
    public partial class ItemsControllerTests
    {
        [Fact]
        public void DeleteItem_endpoint_config()
        {
            var method = Utils.GetMethod<ItemsController>(nameof(ItemsController.DeleteItem));
            method.ShouldNotBeNull();

            var attributes = method?.GetCustomAttributes(typeof(HttpDeleteAttribute), true);
            attributes.Length.ShouldBeGreaterThan(0, "Must have HttpDelete attribute");

            var deleteAtr = attributes[0] as HttpDeleteAttribute;
            deleteAtr.Template.ShouldBe("[action]");
        
            attributes = method?.GetCustomAttributes(typeof(ServiceFilterAttribute<SecurityFilterAttribute>), true);
            attributes.Length.ShouldBeGreaterThan(0, "Must require authorization");

            var idParam = method?.GetParameters()[0];
            idParam.Name.ShouldBe("id");
            
            idParam.GetCustomAttributes(typeof(FromQueryAttribute), true).ShouldNotBeEmpty();
        }
    }
}
