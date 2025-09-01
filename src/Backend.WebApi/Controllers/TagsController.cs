using Backend.Core.Manager;
using Backend.Models;
using Backend.WebApi.ActionFilters;
using Microsoft.AspNetCore.Mvc;

namespace Backend.WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TagsController: ControllerBase
    {
        private ITagManager _tagManager;
        public TagsController(ITagManager tagManager)
        {
            _tagManager = tagManager;
        }

        [HttpPost("[action]")]
        [ServiceFilter<SecurityFilterAttribute>]
        public ActionResult CreateTag(Tag tag)
        {
            var userId = Convert.ToInt32(HttpContext.Items["UserId"]);
            tag.UserId = userId;
            var TagId = _tagManager.CreateTag(tag);
            return Ok(TagId);
        }

        [HttpGet("[action]")]
        [ServiceFilter<SecurityFilterAttribute>]
        public ActionResult GetTags()
        {
            var userId = Convert.ToInt32(HttpContext.Items["UserId"]);
            var Tags = _tagManager.GetTags(userId);
            return Ok(Tags);
        }

        [HttpDelete("[action]")]
        [ServiceFilter<SecurityFilterAttribute>]
        public ActionResult DeleteTag([FromQuery] int id)
        {
            var userId = Convert.ToInt32(HttpContext.Items["UserId"]);
            try
            {
                _tagManager.DeleteTag(id, userId);
            }
            catch (TagNotFoundException _)
            {
                return NotFound();
            }
            catch (UnauthorizedAccessException _)
            {
                return Unauthorized();
            }

            return Ok();
        }
    }
}
