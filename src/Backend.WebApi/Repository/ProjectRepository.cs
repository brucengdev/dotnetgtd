using Backend.Core.Repository;
using Backend.Models;

namespace Backend.WebApi.Repository;

public class ProjectRepository: IProjectRepository
{
    private GTDContext _dbContext;
    public ProjectRepository(GTDContext dbContext)
    {
        _dbContext = dbContext;
    }
    public int CreateProject(Project project)
    {
        _dbContext.Projects.Add(project);
        _dbContext.SaveChanges();
        return project.Id;
    }

    public IEnumerable<Project> GetProjects(int userId)
    {
        return _dbContext.Projects.Where(p => p.UserId == userId);
    }

    public void DeleteProject(int projectId)
    {
        var project = _dbContext.Items.Find(projectId);
        if (project != null)
        {
            _dbContext.Items.Remove(project);
            _dbContext.SaveChanges();
        }
    }
}