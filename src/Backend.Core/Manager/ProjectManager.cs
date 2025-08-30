using Backend.Core.Repository;
using Backend.Models;

namespace Backend.Core.Manager;

public class ProjectManager: IProjectManager
{
    private IProjectRepository _projectRepo;
    private IUserRepository _userRepo;
    public ProjectManager(IProjectRepository projectRepo, IUserRepository userRepo)
    {
        _projectRepo = projectRepo;
        _userRepo = userRepo;
    }
    public int CreateProject(Project project)
    {
        if (_userRepo.GetUser(project.UserId) == null)
        {
            throw new UserNotFoundException();
        }
        return _projectRepo.CreateProject(project);
    }

    public IEnumerable<Project> GetProjects(int userId)
    {
        return _projectRepo.GetProjects(userId);
    }

    public void DeleteProject(int projectId, int userId)
    {
        var project = _projectRepo.GetProjectById(projectId);
        if (project == null)
        {
            throw new ProjectNotFoundException();
        }
        if (project.UserId != userId)
        {
            throw new UnauthorizedAccessException("User does not own this project");
        }
        _projectRepo.DeleteProject(projectId);
    }
}