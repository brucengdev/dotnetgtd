using Backend.Core.Manager;
using Backend.Models;
using Backend.WebApi.ActionFilters;
using Backend.WebApi.Extensions;
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
            tag.UserId = this.CurrentUserId();
            var TagId = _tagManager.CreateTag(tag);
            return Ok(TagId);
        }

        [HttpGet("[action]")]
        [ServiceFilter<SecurityFilterAttribute>]
        public ActionResult GetTags()
        {
            var Tags = _tagManager.GetTags(this.CurrentUserId());
            return Ok(Tags);
        }

        [HttpDelete("[action]")]
        [ServiceFilter<SecurityFilterAttribute>]
        public ActionResult DeleteTag([FromQuery] int id)
        {
            try
            {
                _tagManager.DeleteTag(id, this.CurrentUserId());
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
