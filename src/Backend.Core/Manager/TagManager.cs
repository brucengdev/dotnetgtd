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
    public int CreateTag(TagServiceModel inputTag, int userId)
    {
        if (_userRepo.GetUser(userId) == null)
        {
            throw new UserNotFoundException();
        }
        var tag = Tag.FromServiceModel(inputTag);
        tag.UserId = userId;
        return _tagRepo.CreateTag(tag);
    }

    public void UpdateTag(TagServiceModel inputTag, int userId)
    {
        var tag = Tag.FromServiceModel(inputTag);
        tag.UserId = userId;
        if (!_userRepo.UserExists(userId))
        {
            throw new UserNotFoundException();
        }

        var existingTag = _tagRepo.GetTagById(tag.Id);
        if (existingTag == null)
        {
            throw new TagNotFoundException();
        }

        if (existingTag.UserId != userId)
        {
            throw new UnauthorizedAccessException();
        }

        _tagRepo.UpdateTag(tag);
    }

    public IEnumerable<TagServiceModel> GetTags(int userId)
    {
        return _tagRepo.GetTags(userId)
            .Select(t => TagServiceModel.FromTag(t));
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