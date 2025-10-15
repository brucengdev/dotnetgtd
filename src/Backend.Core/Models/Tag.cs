namespace Backend.Models;

public class Tag
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int UserId { get; set; }
    
    public User? User { get; set; }

    public static Tag FromServiceModel(TagServiceModel inputTag)
    {
        return new()
        {
            Id = inputTag.Id,
            Name = inputTag.Name
        };
    }

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

    public void MakeSame(Tag other)
    {
        Id = other.Id;
        Name = other.Name;
        UserId = other.UserId;
    }
}