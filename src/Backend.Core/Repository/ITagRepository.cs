using Backend.Models;

namespace Backend.Core.Repository;

public interface ITagRepository
{
    int CreateTag(Tag tag);
    void UpdateTag(Tag tag);
    
    IEnumerable<Tag> GetTags(int userId);

    void DeleteTag(int tagId);

    Tag GetTagById(int tagId);

    bool TagExists(int tagId);
    
    void Clear(int userId);
}
