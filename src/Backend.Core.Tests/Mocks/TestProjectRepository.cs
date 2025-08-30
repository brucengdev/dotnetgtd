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

    public IEnumerable<Project> GetProjects(int userId)
    {
        return Projects.Where(p => p.UserId == userId);
    }

    public void DeleteProject(int projectId)
    {
        Projects.Remove(Projects.Find(p => p.Id == projectId));
    }
}