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

    public void UpdateProject(Project project)
    {
    }

    public IEnumerable<Project> GetProjects(int userId, 
        IEnumerable<bool>? completionStatuses,
        IEnumerable<bool>? laterStatuses)
    {
        var results = _dbContext.Projects.Where(p => p.UserId == userId);
        if (laterStatuses != null)
        {
            results = results.Where(p => laterStatuses.Contains(p.Later));
        }
        
        if (completionStatuses != null)
        {
            results = results.Where(p => completionStatuses.Contains(p.Done));
        }

        return results;
    }

    public void DeleteProject(int projectId)
    {
        var project = _dbContext.Projects.Find(projectId);
        if (project != null)
        {
            _dbContext.Projects.Remove(project);
            _dbContext.SaveChanges();
        }
    }

    public Project GetProjectById(int projectId)
    {
        return _dbContext.Projects.Find(projectId);
    }
}