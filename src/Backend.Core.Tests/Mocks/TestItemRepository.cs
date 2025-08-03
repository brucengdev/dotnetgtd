using Backend.Core.Repository;
using Backend.Models;

namespace Backend.Core.Tests.Mocks;

public class TestItemRepository: IItemRepository
{
    public List<Item> Items { get; set; } = new();
    public int CreateItem(Item item)
    {
        item.Id = Items.Count + 1;
        Items.Add(item);
        return item.Id;
    }

    public IEnumerable<Item> GetItems(int userId)
    {
        return Items.Where(i => i.UserId == userId);
    }

    public void DeleteItem(int itemId)
    {
        var item = Items.Find(i => i.Id == itemId);
        if (item != null)
        {
            Items.Remove(item);
        }
    }

    public Item? GetItem(int itemId)
    {
        return Items.Find(i => i.Id == itemId);
    }
}