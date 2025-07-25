namespace Backend.Models;

public class Item
{
    public string Description { get; set; }
    public int UserId { get; set; }

    public override bool Equals(object? obj)
    {
        if (obj is not Item)
        {
            return false;
        }

        var otherItem = obj as Item;
        return Description == otherItem.Description
               && UserId == otherItem.UserId;
    }
}