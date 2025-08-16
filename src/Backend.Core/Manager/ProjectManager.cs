using Backend.Core.Repository;
using Backend.Models;

namespace Backend.Core.Manager;

public class ProjectManager: IProjectManager
{
    public ProjectManager(IProjectRepository _)
    {
        
    }
    public int CreateProject(Project project)
    {
        return 0;
    }
}