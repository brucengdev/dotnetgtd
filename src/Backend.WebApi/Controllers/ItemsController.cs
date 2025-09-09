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
        public ActionResult CreateItem(ItemServiceModel itemService)
        {
            var userId = Convert.ToInt32(HttpContext.Items["UserId"]);
            var itemId = _itemManager.CreateItem(itemService, userId);
            return Ok(itemId);
        }
        
        [HttpGet("[action]")]
        [ServiceFilter<SecurityFilterAttribute>]
        public ActionResult GetItems(string? complete, string? later)
        {
            var userId = Convert.ToInt32(HttpContext.Items["UserId"]);
            var completionStatuses = (complete??"").Split(",")
                .Where(statusName => !string.IsNullOrEmpty(statusName))
                .Select(statusName => statusName == Constants.COMPLETED);
            return Ok(_itemManager.GetItems(userId, completionStatuses, []));
        }

        [HttpDelete("[action]")]
        [ServiceFilter<SecurityFilterAttribute>]
        public ActionResult DeleteItem([FromQuery] int id)
        {
            var userId = Convert.ToInt32(HttpContext.Items["UserId"]);
            try
            {
                _itemManager.DeleteItem(id, userId);
            }
            catch (UnauthorizedAccessException _)
            {
                return Unauthorized();
            }
            catch (ItemNotFoundException _)
            {
                return NotFound();
            }

            return Ok();
        }
    }
}
