namespace Backend.Models;

public class TagServiceModel
{
    public int Id { get; set; }
    public string Name { get; set; }

    public static TagServiceModel FromTag(Tag tag)
    {
        return new()
        {
            Id = tag.Id,
            Name = tag.Name
        };
    }

    public override bool Equals(object? obj)
    {
        if (obj is not TagServiceModel other)
        {
            return false;
        }

        return Id == other.Id && Name == other.Name;
    }
}