using Backend.Models;

namespace Backend.Core.Manager;

public class ProjectNotFoundException: Exception { }

public interface IProjectManager
{
    int CreateProject(Project project);
    
    IEnumerable<Project> GetProjects(int userId);

    void DeleteProject(int projectId, int userId);
}
