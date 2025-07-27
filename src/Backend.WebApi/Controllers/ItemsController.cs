using Backend.Core.Manager;
using Backend.Models;
using Backend.WebApi.ActionFilters;
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

        [HttpPost("[action]")]
        [ServiceFilter<SecurityFilterAttribute>]
        public ActionResult CreateItem(Item item)
        {
            var userId = HttpContext.Request.Headers["UserId"];
            var itemId = _itemManager.CreateItem(item, Convert.ToInt32(userId));
            return Ok(itemId);
        }
        
        [HttpGet("[action]")]
        [ServiceFilter<SecurityFilterAttribute>]
        public ActionResult GetItems()
        {
            return Ok();
        }
    }
}
