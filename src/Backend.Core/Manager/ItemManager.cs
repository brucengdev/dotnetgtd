using Backend.Core.Repository;
using Backend.Models;

namespace Backend.Core.Manager;

public class ItemManager: IItemManager
{
    private IItemRepository _itemRepo;
    public ItemManager(IItemRepository itemRepo)
    {
        _itemRepo = itemRepo;
    }

    public int CreateItem(Item item, int userId)
    {
        item.UserId = userId;
        return _itemRepo.CreateItem(item);
    }

    public IEnumerable<Item> GetItems(int userId)
    {
        return _itemRepo.GetItems(userId);
    }
}