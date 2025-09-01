using Backend.Models;

namespace Backend.Core.Repository;

public interface ITagRepository
{
    int CreateTag(Tag tag);
    
    IEnumerable<Tag> GetTags(int userId);

    void DeleteTag(int tagId);

    Tag GetTagById(int tagId);
}
