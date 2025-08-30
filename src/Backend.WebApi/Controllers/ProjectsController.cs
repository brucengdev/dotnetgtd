using Backend.Core.Manager;
using Backend.Models;
using Backend.WebApi.ActionFilters;
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
            var userId = Convert.ToInt32(HttpContext.Items["UserId"]);
            project.UserId = userId;
            var projectId = _projectManager.CreateProject(project);
            return Ok(projectId);
        }

        [HttpGet("[action]")]
        [ServiceFilter<SecurityFilterAttribute>]
        public ActionResult GetProjects()
        {
            var userId = Convert.ToInt32(HttpContext.Items["UserId"]);
            var projects = _projectManager.GetProjects(userId);
            return Ok(projects);
        }

        [HttpDelete("[action]")]
        [ServiceFilter<SecurityFilterAttribute>]
        public void DeleteProject()
        {
            
        }
    }
}
