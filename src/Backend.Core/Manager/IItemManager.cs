using Backend.Models;

namespace Backend.Core.Manager;

public interface IItemManager
{
    int CreateItem(ItemServiceModel newItemServiceModel, int userId);
    IEnumerable<ItemServiceModel> GetItems(
        int userId,
        IEnumerable<bool> completionStatuses,
        IEnumerable<bool> laterStatuses);

    void DeleteItem(int itemId, int userId);
}

public class ItemNotFoundException: Exception { }