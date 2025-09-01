namespace Backend.Models;

public class Tag
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int UserId { get; set; }
    
    public User User { get; set; }

    public override bool Equals(object? obj)
    {
        if (obj is not Tag)
        {
            return false;
        }

        var otherTag = obj as Tag;
        return Id == otherTag.Id 
                && Name == otherTag.Name
                && UserId == otherTag.UserId;
    }
}