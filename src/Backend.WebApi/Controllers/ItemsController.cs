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
        
        [HttpPut("[action]")]
        [ServiceFilter<SecurityFilterAttribute>]
        public ActionResult UpdateItem(ItemServiceModel itemService)
        {
            return Ok();
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

            IEnumerable<int>? projectIds;
            bool tasksWithNoProject = false;
            if (projectId == null || projectId == "*")
            {
                projectIds = null;
                tasksWithNoProject = true;
            } else if (projectId == "")
            {
                projectIds = [];
                tasksWithNoProject = false;
            }
            else
            {
                var tokens = projectId.Split(",");
                projectIds = tokens
                    .Where(v => v != "nonnull" && v != "null")
                    .Select(v => Convert.ToInt32(v))
                    .ToList();
                if (tokens.Contains("nonnull"))
                {
                    projectIds = null;
                }
                if (tokens.Contains("null"))
                {
                    tasksWithNoProject = true;
                }
            }

            var tasksWithNoTags = true;
            IEnumerable<int>? tagIdValues;
            if (tagIds == null || tagIds == "*")
            {
                tagIdValues = null;
            } else if (tagIds == "")
            {
                tagIdValues = [];
                tasksWithNoTags = false;
            }
            else
            {
                var tagFilters = tagIds.Split(",");
                tagIdValues = tagFilters
                    .Where(t => t != "null" && t != "nonnull")
                    .Select(t => Convert.ToInt32(t));
                if (tagFilters.Contains("nonnull"))
                {
                    tagIdValues = null;
                }

                tasksWithNoTags = tagFilters.Contains("null");
            }

            var items = _itemManager.GetItems(userId, completionStatuses, laterStatuses,
                projectIds, tasksWithNoProject, tagIdValues, tasksWithNoTags);
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
