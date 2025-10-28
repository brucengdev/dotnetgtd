using Backend.Models;

namespace Backend.Core.Repository;

public interface IItemRepository
{
    int CreateItem(Item item);
    void UpdateItem(Item item);
    IEnumerable<Item> GetItems(int userId, 
        IEnumerable<bool>? completionStatuses = null,
        IEnumerable<bool>? laterStatuses = null,
        IEnumerable<int>? projectIds = null,
        bool tasksWithNoProject = true,
        IEnumerable<int>? tagIds = null,
        bool tasksWithNoTag = true);
    void DeleteItem(int itemId);
    Item? GetItem(int itemId);

    void Clear(int userId);
}