using Backend.Models;

namespace Backend.Core.Manager;

public class TagNotFoundException: Exception { }

public interface ITagManager
{
    int CreateTag(Tag tag);

    void UpdateTag(TagServiceModel tag, int userId);
    
    IEnumerable<Tag> GetTags(int userId);

    void DeleteTag(int tagId, int userId);
}
