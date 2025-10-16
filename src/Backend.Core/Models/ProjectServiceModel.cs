namespace Backend.Models;

public class ProjectServiceModel
{
    
    public int Id { get; set; }
    public string Name { get; set; }
    public bool Later { get; set; }
    public bool Done { get; set; }

    public static ProjectServiceModel FromProject(Project project)
    {
        return new()
        {
            Id = project.Id,
            Name = project.Name,
            Later = project.Later,
            Done = project.Done
        };
    }

    public override bool Equals(object? obj)
    {
        if (obj is not ProjectServiceModel other)
        {
            return false;
        }
        return Id == other.Id
            && Name == other.Name
            && Later == other.Later
            && Done == other.Done;
    }
}