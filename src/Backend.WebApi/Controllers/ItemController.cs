using Backend.Core.Manager;
using Backend.Models;

namespace Backend.WebApi.Controllers
{
    public class ItemController
    {
        private IItemManager _itemManager;
        public ItemController(IItemManager itemManager)
        {
            _itemManager = itemManager;
        }

        public void AddItem(Item item)
        {
            _itemManager.CreateItem(item);
        }
    }
}
