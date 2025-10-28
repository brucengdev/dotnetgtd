using Backend.Core.Repository;
using Backend.Models;

namespace Backend.Core.Tests.Mocks;

public class TestTagRepository: ITagRepository
{
    private readonly TestDataSource _data;
    public TestTagRepository(TestDataSource data)
    {
        _data = data;
    }
    public int CreateTag(Tag tag)
    {
        tag.Id = _data.Tags.Count + 1;
        _data.Tags.Add(tag);
        return tag.Id;
    }

    public void UpdateTag(Tag tag)
    {
        _data.Tags.RemoveAt(_data.Tags.FindIndex(t => t.Id == tag.Id));
        _data.Tags.Add(tag);
    }

    public IEnumerable<Tag> GetTags(int userId)
    {
        return _data.Tags.Where(p => p.UserId == userId);
    }

    public void DeleteTag(int tagId)
    {
        _data.Tags.Remove(_data.Tags.Find(p => p.Id == tagId));
    }

    public Tag GetTagById(int tagId)
    {
        return _data.Tags.Find(p => p.Id == tagId);
    }

    public bool TagExists(int tagId)
    {
        return _data.Tags.Exists(t => t.Id == tagId);
    }
}
