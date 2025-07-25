using Backend.Models;

namespace Backend.Core.Manager;

public interface IItemManager
{
    void CreateItem(Item item, int userId);
}