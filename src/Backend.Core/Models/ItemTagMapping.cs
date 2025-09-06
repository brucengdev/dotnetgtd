namespace Backend.Models;

public class ItemTagMapping
{
    public int Id { get; set; }
    public int ItemId { get; set; }

    public Item Item { get; set; }
    public int TagId { get; set; }
    public Tag Tag { get; set; }

    public override bool Equals(object? obj)
    {
        if (obj is not ItemTagMapping)
        {
            return false;
        }
        var other = obj as ItemTagMapping;
        return Id == other.Id
               && ItemId == other.ItemId
               && TagId == other.TagId;
    }
}