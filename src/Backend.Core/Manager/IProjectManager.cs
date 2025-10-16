using Backend.Models;

namespace Backend.Core.Manager;

public class ProjectNotFoundException: Exception { }

public interface IProjectManager
{
    int CreateProject(ProjectServiceModel project, int userId);

    void UpdateProject(ProjectServiceModel project, int userId);

    IEnumerable<Project> GetProjects(int userId,
        IEnumerable<bool>? completionStatuses,
        IEnumerable<bool>? laterStatuses);

    void DeleteProject(int projectId, int userId);
}
