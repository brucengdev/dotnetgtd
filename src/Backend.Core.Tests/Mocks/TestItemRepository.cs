using Backend.Core.Repository;
using Backend.Models;

namespace Backend.Core.Tests.Mocks;

public class TestItemRepository: IItemRepository
{
    private TestDataSource _data;
    public TestItemRepository(TestDataSource data)
    {
        _data = data;
    }
    public int CreateItem(Item item)
    {
        item.Id = _data.Items.Count + 1;
        _data.Items.Add(item);
        return item.Id;
    }

    public IEnumerable<Item> GetItems(int userId,
        IEnumerable<bool> completionStatuses,
        IEnumerable<bool> laterStatuses,
        IEnumerable<int>? projectIds,
        bool tasksWithNoProjects,
        IEnumerable<int>? tagIds = null,
        bool tasksWithNoTag = true)
    {
        var results = _data.Items.Where(i => i.UserId == userId);
        if (completionStatuses.Count() > 0)
        {
            results = results.Where(i => completionStatuses.Contains(i.Done));
        }
        results = results.Select(i =>
        {
            var clone = new Item(i);
            clone.ItemTagMappings = _data.ItemTagMappings.Where(m => m.ItemId == i.Id).ToList();
            return clone;
        });
        return results;
    }

    public void DeleteItem(int itemId)
    {
        var item = _data.Items.Find(i => i.Id == itemId);
        if (item != null)
        {
            _data.Items.Remove(item);
        }
    }

    public Item? GetItem(int itemId)
    {
        return _data.Items.Find(i => i.Id == itemId);
    }
}