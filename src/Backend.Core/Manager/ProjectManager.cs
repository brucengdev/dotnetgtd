using Backend.Core.Repository;
using Backend.Models;

namespace Backend.Core.Manager;

public class ProjectManager: IProjectManager
{
    private IProjectRepository _projectRepo;
    public ProjectManager(IProjectRepository projectRepo)
    {
        _projectRepo = projectRepo;
    }
    public int CreateProject(Project project)
    {
        return _projectRepo.CreateProject(project);
    }
}