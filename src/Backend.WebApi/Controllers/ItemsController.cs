using System.Collections.Concurrent;
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
        public ActionResult GetItems(string? complete, string? later, string? projectId, string? tagIds = null)
        {
            var userId = Convert.ToInt32(HttpContext.Items["UserId"]);
            IEnumerable<bool> completionStatuses;
            if (complete == null || complete == "*")
            {
                completionStatuses = [true, false];
            }else if (complete == "")
            {
                completionStatuses = [];
            }
            else 
            {
                completionStatuses = complete.Split(",").Select(f => f == "completed");
            }
            IEnumerable<bool> laterStatuses = [];
            if (later == null || later == "*")
            {
                laterStatuses = [true, false];
            } else if (later == "")
            {
                laterStatuses = [];
            } else
            {
                laterStatuses = later.Split(",").Select(f => f == "later");
            }

            IEnumerable<int>? projectIdValues;
            if (projectId == null || projectId == "*")
            {
                projectIdValues = null;
            } else if (projectId == "")
            {
                projectIdValues = [];
            }
            else
            {
                projectIdValues = [Convert.ToInt32(projectId)];
            }

            IEnumerable<int>? tagIdValues;
            if (tagIds == null || tagIds == "*")
            {
                tagIdValues = null;
            } else if (tagIds == "")
            {
                tagIdValues = [];
            }
            else
            {
                tagIdValues = tagIds.Split(",").Select(t => Convert.ToInt32(t));
            }

            var items = _itemManager.GetItems(userId, completionStatuses, laterStatuses,
                projectIdValues, false, tagIdValues);
            return Ok(items);
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
