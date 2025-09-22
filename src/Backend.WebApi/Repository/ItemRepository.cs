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
        IEnumerable<bool>? completionStatuses = null,
        IEnumerable<bool>? laterStatuses = null,
        IEnumerable<int>? projectIds = null,
        bool tasksWithNoProject = true,
        IEnumerable<int>? tagIds = null)
    {
        //eagerly load the item tag mappings
        var results =  _dbContext.Items
            .Include(i => i.ItemTagMappings)
            .Where(i => i.UserId == userId);
        if (completionStatuses != null)
        {
            results = results.Where(i => completionStatuses.Contains(i.Done));
        }

        if (laterStatuses != null)
        {
            results = results.Where(i => laterStatuses.Contains(i.Later));
        }

        if (projectIds == null)
        {
            results = results.Where(i => tasksWithNoProject || i.ProjectId != null);
        }
        else
        {
            results = results.Where(i =>
                i.ProjectId != null && projectIds.Contains(i.ProjectId.Value)
            );
        }

        if (tagIds != null && tagIds.Any())
        {
            results = results.Where(i => i.ItemTagMappings.Where(m => tagIds.Contains(m.TagId)).Any());
        }

        if (tagIds != null && !tagIds.Any())
        {
            results = results.Where(i => !i.ItemTagMappings.Any());
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