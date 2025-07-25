using Backend.Core.Repository;
using Backend.Models;

namespace Backend.Core.Tests.Mocks;

public class TestItemRepository: IItemRepository
{
    public List<Item> Items { get; set; } = new();
    public void CreateItem(Item item)
    {
        item.Id = Items.Count + 1;
        Items.Add(item);
    }
}