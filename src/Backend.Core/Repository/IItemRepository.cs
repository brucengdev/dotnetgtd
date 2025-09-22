using Backend.Models;

namespace Backend.Core.Repository;

public interface IItemRepository
{
    int CreateItem(Item item);
    IEnumerable<Item> GetItems(int userId, 
        IEnumerable<bool>? completionStatuses = null,
        IEnumerable<bool>? laterStatuses = null,
        IEnumerable<int>? projectIds = null,
        bool tasksWithNoProject = false,
        IEnumerable<int>? tagIds = null);
    void DeleteItem(int itemId);
    Item? GetItem(int itemId);
}