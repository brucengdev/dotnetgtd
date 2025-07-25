using Backend.Core.Repository;
using Backend.Models;

namespace Backend.Core.Tests.Mocks;

public class TestItemRepository: IItemRepository
{
    public List<Item> Items { get; set; } = new();
    public void CreateItem(Item item)
    {
        Items.Add(item);
    }
}