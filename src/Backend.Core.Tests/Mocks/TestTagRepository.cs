using Backend.Core.Repository;
using Backend.Models;

namespace Backend.Core.Tests.Mocks;

public class TestTagRepository: ITagRepository
{
    public List<Tag> Tags { get; set; } = new ();
    public int CreateTag(Tag tag)
    {
        tag.Id = Tags.Count + 1;
        Tags.Add(tag);
        return tag.Id;
    }

    public void UpdateTag(Tag tag)
    {
        Tags.RemoveAt(Tags.FindIndex(t => t.Id == tag.Id));
        Tags.Add(tag);
    }

    public IEnumerable<Tag> GetTags(int userId)
    {
        return Tags.Where(p => p.UserId == userId);
    }

    public void DeleteTag(int tagId)
    {
        Tags.Remove(Tags.Find(p => p.Id == tagId));
    }

    public Tag GetTagById(int tagId)
    {
        return Tags.Find(p => p.Id == tagId);
    }
}
