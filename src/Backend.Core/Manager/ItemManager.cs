using Backend.Core.Repository;
using Backend.Models;
using Microsoft.VisualBasic;

namespace Backend.Core.Manager;

public class ItemManager: IItemManager
{
    private IItemRepository _itemRepo;
    private IUserRepository _userRepo;
    private IItemTagMappingRepo _itemTagMappingRepo;
    public ItemManager(IItemRepository itemRepo, 
        IUserRepository userRepo, 
        IItemTagMappingRepo itemTagMappingRepo)
    {
        _itemRepo = itemRepo;
        _userRepo = userRepo;
        _itemTagMappingRepo = itemTagMappingRepo;
    }

    public int CreateItem(ItemServiceModel newItemServiceModel, int userId)
    {
        var user = _userRepo.GetUser(userId);
        if (user == null)
        {
            throw new UserNotFoundException();
        }

        newItemServiceModel.UserId = userId;

        var item = Item.FromServiceModel(newItemServiceModel);
        int itemId = _itemRepo.CreateItem(item);

        foreach (var tagId in (newItemServiceModel.TagIds ?? []))
        {
            _itemTagMappingRepo.CreateMapping(new()
            {
                ItemId = itemId,
                TagId = tagId
            });
        }

        return itemId;
    }

    public void UpdateItem(ItemServiceModel newItemServiceModel, int userId)
    {
        var user = _userRepo.GetUser(userId);
        if (user == null)
        {
            throw new UserNotFoundException();
        }

        var existingItem = _itemRepo.GetItem(newItemServiceModel.Id);
        if (existingItem.UserId != userId)
        {
            throw new UnauthorizedAccessException("User does not own this item");
        }
        var item = Item.FromServiceModel(newItemServiceModel);
        _itemRepo.UpdateItem(item);
        
        foreach (var tagId in (newItemServiceModel.TagIds ?? []))
        {
            _itemTagMappingRepo.CreateMapping(new()
            {
                ItemId = item.Id,
                TagId = tagId
            });
        }
    }

    public IEnumerable<ItemServiceModel> GetItems(int userId,
        IEnumerable<bool> completionStatuses,
        IEnumerable<bool> laterStatuses,
        IEnumerable<int>? projectIds,
        bool tasksWithNoProject,
        IEnumerable<int>? tagIds,
        bool tasksWithNoTags)
    {
        var items = _itemRepo.GetItems(
            userId, 
            completionStatuses,
            laterStatuses,
            projectIds,
            tasksWithNoProject,
            tagIds,
            tasksWithNoTags);
        return items.Select(i => ItemServiceModel.FromItem(i));
    }

    public void DeleteItem(int itemId, int userId)
    {
        var item = _itemRepo.GetItem(itemId);
        if (item == null)
        {
            throw new ItemNotFoundException();
        }
        if (item?.UserId != userId)
        {
            throw new UnauthorizedAccessException("User is not allowed to delete items owned by other users");
        }

        _itemTagMappingRepo.DeleteByItemId(itemId);
        _itemRepo.DeleteItem(itemId);
    }
}