namespace Backend.Models;

public class Item
{
    public int Id { get; set; }
    public string Description { get; set; }
    public int UserId { get; set; }
    
    public int ProjectId { get; set; }

    public override bool Equals(object? obj)
    {
        if (obj is not Item)
        {
            return false;
        }

        var otherItem = obj as Item;
        return Id == otherItem.Id 
                && Description == otherItem.Description
                && UserId == otherItem.UserId
                && ProjectId == otherItem.ProjectId;
    }
}