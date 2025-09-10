using Backend.Core.Repository;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.WebApi.Repository;

public class ItemRepository: IItemRepository
{
    private GTDContext _dbContext;
    public ItemRepository(GTDContext dbContext)
    {
        _dbContext = dbContext;
    }
    public int CreateItem(Item item)
    {
        _dbContext.Items.Add(item);
        _dbContext.SaveChanges();
        return item.Id;
    }

    public IEnumerable<Item> GetItems(int userId,
        IEnumerable<bool> completionStatuses,
        IEnumerable<bool> laterStatuses,
        bool fetchTagMappings = false)
    {
        var results =  _dbContext.Items.Where(i => i.UserId == userId);
        if (completionStatuses.Any())
        {
            results = results.Where(i => completionStatuses.Contains(i.Done));
        }

        if (laterStatuses.Any())
        {
            results = results.Where(i => laterStatuses.Contains(i.Later));
        }
        if (fetchTagMappings)
        {
            results = results.Include(i => i.ItemTagMappings);
        }

        return results;
    }

    public void DeleteItem(int itemId)
    {
        var item = _dbContext.Items.Find(itemId);
        if (item != null)
        {
            _dbContext.Items.Remove(item);
            _dbContext.SaveChanges();
        }
    }

    public Item? GetItem(int itemId)
    {
        var item = _dbContext.Items.Find(itemId);
        return item;
    }
}