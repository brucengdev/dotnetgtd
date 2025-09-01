namespace Backend.Models;

public class CreateItemModel
{
    public string Description { get; set; }
    public int? ProjectId { get; set; }
    public IEnumerable<int>? TagIds { get; set; }
    
    public int UserId { get; set; }
}