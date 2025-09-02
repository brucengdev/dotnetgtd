using Backend.Models;

namespace Backend.Core.Manager;

public interface IItemManager
{
    int CreateItem(ItemRestModel newItemRestModel, int userId);
    IEnumerable<ItemRestModel> GetItems(int userId);

    void DeleteItem(int itemId, int userId);
}

public class ItemNotFoundException: Exception { }