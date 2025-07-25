using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Backend.Core.Manager;
using Backend.Models;
using Backend.WebApi.Controllers;
using Moq;

namespace Backend.WebApi.Tests.Controller
{
    public class ItemControllerTests
    {
        [Fact]
        public void Item_must_be_added()
        {
            //arrange
            var itemManager = new Mock<IItemManager>();
            var sut = new ItemController(itemManager.Object);

            //act
            sut.AddItem(new Item
            {
                Description = "Foo"
            });

            //assert
        }
    }
}
