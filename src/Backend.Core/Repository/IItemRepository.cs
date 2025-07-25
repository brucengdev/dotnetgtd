using Backend.Models;

namespace Backend.Core.Repository;

public interface IItemRepository
{
    void CreateItem(Item item);
}