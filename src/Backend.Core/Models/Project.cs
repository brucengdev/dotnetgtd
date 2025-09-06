namespace Backend.Models;

public class Project
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int UserId { get; set; }
    public bool Later { get; set; }

    public override bool Equals(object? obj)
    {
        if (obj is not Project)
        {
            return false;
        }

        var otherProject = obj as Project;
        return Id == otherProject.Id
               && Name == otherProject.Name
               && UserId == otherProject.UserId
               && Later == otherProject.Later;
    }
}