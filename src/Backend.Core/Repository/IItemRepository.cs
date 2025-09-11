using Backend.Models;

namespace Backend.Core.Repository;

public interface IItemRepository
{
    int CreateItem(Item item);
    IEnumerable<Item> GetItems(int userId, 
        IEnumerable<bool> completionStatuses,
        IEnumerable<bool> laterStatuses,
        int? projectId,
        bool fetchTagMappings = false);
    void DeleteItem(int itemId);
    Item? GetItem(int itemId);
}