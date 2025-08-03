using Backend.Core.Repository;
using Backend.Models;

namespace Backend.Core.Manager;

public class ItemManager: IItemManager
{
    private IItemRepository _itemRepo;
    private IUserRepository _userRepo;
    public ItemManager(IItemRepository itemRepo, IUserRepository userRepo)
    {
        _itemRepo = itemRepo;
        _userRepo = userRepo;
    }

    public int CreateItem(Item item, int userId)
    {
        var user = _userRepo.GetUser(userId);
        if (user == null)
        {
            throw new UserNotFoundException();
        }
        item.UserId = userId;
        return _itemRepo.CreateItem(item);
    }

    public IEnumerable<Item> GetItems(int userId)
    {
        return _itemRepo.GetItems(userId);
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
        _itemRepo.DeleteItem(itemId);
    }
}