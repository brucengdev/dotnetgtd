namespace Backend.Models;

public class Item
{
    public int Id { get; set; }
    public string Description { get; set; }
    
    public int UserId { get; set; }
    public User? User { get; set; }
    
    public int? ProjectId { get; set; }
    public Project? Project { get; set; }
    
    public ICollection<ItemTagMapping>? ItemTagMappings { get; set; }
    
    public Item() { }

    public Item(Item source)
    {
        Id = source.Id;
        Description = source.Description;
        UserId = source.UserId;
        User = source.User;
        ProjectId = source.ProjectId;
        Project = source.Project;
        ItemTagMappings = source.ItemTagMappings;
    }
    
    public override bool Equals(object? obj)
    {
        if (obj is not Item)
        {
            return false;
        }

        var otherItem = obj as Item;
        var hasSameTagMappings = (ItemTagMappings == null && otherItem.ItemTagMappings == null)
            || (ItemTagMappings != null && ItemTagMappings.SequenceEqual(otherItem.ItemTagMappings));
        return Id == otherItem.Id
               && Description == otherItem.Description
               && UserId == otherItem.UserId
               && ProjectId == otherItem.ProjectId
               && hasSameTagMappings;
    }
}