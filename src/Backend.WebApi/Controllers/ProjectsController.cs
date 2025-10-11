using Backend.Core.Manager;
using Backend.Models;
using Backend.WebApi.ActionFilters;
using Backend.WebApi.Extensions;
using Microsoft.AspNetCore.Mvc;

namespace Backend.WebApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProjectsController: ControllerBase
    {
        private IProjectManager _projectManager;
        public ProjectsController(IProjectManager projectManager)
        {
            _projectManager = projectManager;
        }

        [HttpPost("[action]")]
        [ServiceFilter<SecurityFilterAttribute>]
        public ActionResult CreateProject(Project project)
        {
            project.UserId = this.CurrentUserId();
            var projectId = _projectManager.CreateProject(project);
            return Ok(projectId);
        }

        [HttpGet("[action]")]
        [ServiceFilter<SecurityFilterAttribute>]
        public ActionResult GetProjects(string? complete, string? later)
        {
            IEnumerable<bool>? completionStatuses;
            if (complete == null)
            {
                completionStatuses = null;
            }else
            if (complete == "")
            {
                completionStatuses = [];
            }
            else
            {
                completionStatuses = complete.Split(",").Select(s => s == "completed");
            }
            
            IEnumerable<bool>? laterStatuses;
            if(later == null)
            {
                laterStatuses = null;
            }else
            if (later == "")
            {
                laterStatuses = [];
            }
            else
            {
                laterStatuses = later.Split(",").Select(s => s == "later");
            }
            var projects = _projectManager.GetProjects(this.CurrentUserId(), 
                completionStatuses, laterStatuses);
            return Ok(projects);
        }

        [HttpDelete("[action]")]
        [ServiceFilter<SecurityFilterAttribute>]
        public ActionResult DeleteProject([FromQuery] int id)
        {
            try
            {
                _projectManager.DeleteProject(id, this.CurrentUserId());
            }
            catch (ProjectNotFoundException _)
            {
                return NotFound();
            }
            catch (UnauthorizedAccessException _)
            {
                return Unauthorized();
            }

            return Ok();
        }

        [HttpPut("[action]")]
        [ServiceFilter<SecurityFilterAttribute>]
        public ActionResult UpdateProject(Project project)
        {
            try
            {
                _projectManager.UpdateProject(project, this.CurrentUserId());
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized();
            }

            return Ok();
        }
    }
}
