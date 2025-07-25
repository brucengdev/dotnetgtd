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
        _itemRepo.CreateItem(item);
        return 1;
    }
}