using Backend.Core.Manager;
using Backend.Models;
using Backend.WebApi.Controllers;
using Moq;

namespace Backend.WebApi.Tests.Controller
{
    public partial class ItemControllerTests
    {
        [Fact]
        public void Item_must_be_added()
        {
            //arrange
            var itemManager = new Mock<IItemManager>();
            var sut = new ItemController(itemManager.Object);

            //act
            var item = new Item
            {
                Description = "Foo"
            };
            sut.AddItem(item);

            //assert
            itemManager.Verify(im => im.CreateItem(item), Times.Once);
            itemManager.VerifyNoOtherCalls();
        }
    }
}
