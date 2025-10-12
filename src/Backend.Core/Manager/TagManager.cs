using Backend.Core.Repository;
using Backend.Models;

namespace Backend.Core.Manager;

public class TagManager: ITagManager
{
    private ITagRepository _tagRepo;
    private IUserRepository _userRepo;
    public TagManager(ITagRepository tagRepo, IUserRepository userRepo)
    {
        _tagRepo = tagRepo;
        _userRepo = userRepo;
    }
    public int CreateTag(Tag tag)
    {
        if (_userRepo.GetUser(tag.UserId) == null)
        {
            throw new UserNotFoundException();
        }
        return _tagRepo.CreateTag(tag);
    }

    public void UpdateTag(Tag tag, int userId)
    {
        if (!_userRepo.UserExists(userId))
        {
            throw new UserNotFoundException();
        }

        if (!_tagRepo.TagExists(tag.Id))
        {
            throw new TagNotFoundException();
        }
        _tagRepo.UpdateTag(tag);
    }

    public IEnumerable<Tag> GetTags(int userId)
    {
        return _tagRepo.GetTags(userId);
    }

    public void DeleteTag(int tagId, int userId)
    {
        var tag = _tagRepo.GetTagById(tagId);
        if (tag == null)
        {
            throw new TagNotFoundException();
        }
        if (tag.UserId != userId)
        {
            throw new UnauthorizedAccessException("User does not own this tag");
        }
        _tagRepo.DeleteTag(tagId);
    }
}