using Backend.Models;

namespace Backend.Core.Repository;

public interface IProjectRepository
{
    int CreateProject(Project project);
    
    IEnumerable<Project> GetProjects(int userId);
}