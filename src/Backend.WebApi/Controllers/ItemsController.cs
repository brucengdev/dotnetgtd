using Backend.Core.Manager;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace Backend.WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ItemsController: ControllerBase
    {
        private IItemManager _itemManager;
        public ItemsController(IItemManager itemManager)
        {
            _itemManager = itemManager;
        }

        public void AddItem(Item item)
        {
            _itemManager.CreateItem(item);
        }
    }
}
