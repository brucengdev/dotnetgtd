using Backend.Models;

namespace Backend.Core.Manager;

public class TagNotFoundException: Exception { }

public interface ITagManager
{
    int CreateTag(Tag tag);
    
    IEnumerable<Tag> GetTags(int userId);

    void DeleteTag(int tagId, int userId);
}
