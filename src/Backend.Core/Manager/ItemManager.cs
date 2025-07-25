using Backend.Core.Repository;
using Backend.Models;

namespace Backend.Core.Manager;

public class ItemManager: IItemManager
{
    public ItemManager(IItemRepository itemRepo)
    {
    }

    public int CreateItem(Item item, int userId)
    {
        return 1;
    }
}