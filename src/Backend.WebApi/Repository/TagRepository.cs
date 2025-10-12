using Backend.Core.Repository;
using Backend.Models;

namespace Backend.WebApi.Repository;

public class TagRepository: ITagRepository
{
    private GTDContext _dbContext;
    public TagRepository(GTDContext dbContext)
    {
        _dbContext = dbContext;
    }
    public int CreateTag(Tag tag)
    {
        _dbContext.Tags.Add(tag);
        _dbContext.SaveChanges();
        return tag.Id;
    }
    
    public void UpdateTag(Tag tag)
    {
        var existingTag = _dbContext.Tags.Find(tag.Id);
        existingTag.MakeSame(tag);
        _dbContext.SaveChanges();
    }

    public IEnumerable<Tag> GetTags(int userId)
    {
        return _dbContext.Tags.Where(p => p.UserId == userId);
    }

    public void DeleteTag(int tagId)
    {
        var tag = _dbContext.Tags.Find(tagId);
        if (tag != null)
        {
            _dbContext.Tags.Remove(tag);
            _dbContext.SaveChanges();
        }
    }

    public Tag GetTagById(int tagId)
    {
        return _dbContext.Tags.Find(tagId);
    }

    public bool TagExists(int tagId)
    {
        return _dbContext.Tags.Any(t => t.Id == tagId);
    }
}