namespace Backend.Models;

public class ItemServiceModel
{
    public int Id { get; set; }
    public string Description { get; set; }
    public int? ProjectId { get; set; }
    public IEnumerable<int>? TagIds { get; set; }
    
    public bool Done { get; set; }
    public bool Later { get; set; }

    public static ItemServiceModel FromItem(Item item)
    {
        return new ItemServiceModel()
        {
            Id = item.Id,
            Description = item.Description,
            ProjectId = item.ProjectId,
            TagIds = item.ItemTagMappings?.Select(i => i.TagId) ??  Enumerable.Empty<int>(),
            Done = item.Done,
            Later = item.Later
        };
    }

    public override bool Equals(object? obj)
    {
        var other = obj as ItemServiceModel;
        if (other == null)
        {
            return false;
        }

        var sameTagIds = (TagIds == null && other.TagIds == null)
                         || (TagIds != null && other.TagIds != null && TagIds.SequenceEqual(other.TagIds));
        return Id == other.Id
               && Description == other.Description
               && ProjectId == other.ProjectId
               && sameTagIds
               && Done == other.Done
               && Later == other.Later;
    }
}