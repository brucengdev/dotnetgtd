using Backend.Models;

namespace Backend.Core.Manager;

public interface IItemManager
{
    int CreateItem(Item item, int userId);
}