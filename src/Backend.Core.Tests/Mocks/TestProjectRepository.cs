using Backend.Core.Repository;
using Backend.Models;

namespace Backend.Core.Tests.Mocks;

public class TestProjectRepository: IProjectRepository
{
    private readonly TestDataSource _data;
    public TestProjectRepository(TestDataSource data)
    {
        _data = data;
    }
    public int CreateProject(Project project)
    {
        project.Id = _data.Projects.Count + 1;
        _data.Projects.Add(project);
        return project.Id;
    }

    public void UpdateProject(Project project)
    {
        var projectIndex = _data.Projects.FindIndex(p => p.Id == project.Id);
        _data.Projects[projectIndex] = project;
    }

    public IEnumerable<Project> GetProjects(int userId, 
        IEnumerable<bool>? completionStatuses,
        IEnumerable<bool>? laterStatuses)
    {
        return _data.Projects.Where(p => p.UserId == userId);
    }

    public void DeleteProject(int projectId)
    {
        _data.Projects.Remove(_data.Projects.Find(p => p.Id == projectId));
    }

    public Project GetProjectById(int projectId)
    {
        return _data.Projects.Find(p => p.Id == projectId);
    }

    public void Clear(int userId)
    {
        _data.Projects.RemoveAll(p => p.UserId == userId);
    }
}
