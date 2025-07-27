using Backend.Models;

namespace Backend.Core.Repository;

public interface IItemRepository
{
    int CreateItem(Item item);
    IEnumerable<Item> GetItems(int userId);
}