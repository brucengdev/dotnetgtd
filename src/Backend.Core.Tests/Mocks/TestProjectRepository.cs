using Backend.Core.Repository;
using Backend.Models;

namespace Backend.Core.Tests.Mocks;

public class TestProjectRepository: IProjectRepository
{
    public List<Project> Projects { get; set; } = new ();
    public int CreateProject(Project project)
    {
        project.Id = Projects.Count + 1;
        Projects.Add(project);
        return project.Id;
    }

    public void UpdateProject(Project project)
    {
        var projectIndex = Projects.FindIndex(p => p.Id == project.Id);
        Projects[projectIndex] = project;
    }

    public IEnumerable<Project> GetProjects(int userId, 
        IEnumerable<bool>? completionStatuses,
        IEnumerable<bool>? laterStatuses)
    {
        return Projects.Where(p => p.UserId == userId);
    }

    public void DeleteProject(int projectId)
    {
        Projects.Remove(Projects.Find(p => p.Id == projectId));
    }

    public Project GetProjectById(int projectId)
    {
        return Projects.Find(p => p.Id == projectId);
    }

    public void Clear(int userId)
    {
        throw new NotImplementedException();
    }
}
