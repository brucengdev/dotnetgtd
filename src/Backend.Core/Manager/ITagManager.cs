using Backend.Models;

namespace Backend.Core.Manager;

public class TagNotFoundException: Exception { }

public interface ITagManager
{
    int CreateTag(TagServiceModel tag, int userId);

    void UpdateTag(TagServiceModel tag, int userId);
    
    IEnumerable<TagServiceModel> GetTags(int userId);

    void DeleteTag(int tagId, int userId);
}
