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

    public void UpdateItem(Item item)
    {
        var existing = _dbContext.Items.FirstOrDefault(i => i.Id == item.Id);
        if (existing != null)
        {
            existing.MakeSame(item);
            _dbContext.SaveChanges();
        }
    }

    public IEnumerable<Item> GetItems(int userId,
        IEnumerable<bool>? completionStatuses = null,
        IEnumerable<bool>? laterStatuses = null,
        IEnumerable<int>? projectIds = null,
        bool tasksWithNoProject = true,
        IEnumerable<int>? tagIds = null,
        bool tasksWithNoTag = true)
    {
        //eagerly load the item tag mappings
        var results =  _dbContext.Items
            .Include(i => i.ItemTagMappings)
            .Include(i => i.Project)
            .Where(i => i.UserId == userId);
        if (completionStatuses != null)
        {
            var hasDone = completionStatuses.Contains(true);
            var hasNotDone = completionStatuses.Contains(false);
            results = results.Where(i
                => (hasDone && i.Done)
                   || (hasNotDone && i.Done == false
                        && i.ProjectId == null)
                   || (hasNotDone && i.Done == false 
                                  && i.ProjectId != null
                                  && i.Project.Done == false)
                   || (hasDone && i.Done == false
                                && i.ProjectId != null
                                && i.Project.Done == true
                       )          
            );
        }

        if (laterStatuses != null)
        {
            var hasActive = laterStatuses.Contains(false);
            var hasInactive = laterStatuses.Contains(true);
            results = results.Where(i => 
                (hasActive && i.Later == false && i.ProjectId == null)
                || (hasInactive && i.Later && i.ProjectId == null)
                || (hasActive && i.Later == false && i.ProjectId != null && i.Project.Later == false) 
                || (hasInactive && i.Later && i.ProjectId != null && i.Project.Later)
                || (hasInactive && i.Later == false && i.ProjectId != null && i.Project.Later )
                || (hasInactive && i.Later == true && i.ProjectId != null && i.Project.Later == false )
            );
        }

        if (projectIds == null)
        {
            results = results.Where(i => tasksWithNoProject || i.ProjectId != null);
        }
        else
        {
            results = results.Where(i =>
                (i.ProjectId != null && projectIds.Contains(i.ProjectId.Value))
                ||( i.ProjectId == null && tasksWithNoProject)
            );
        }

        if (tagIds != null)
        {
            results = results.Where(i => 
                i.ItemTagMappings.Where(m => tagIds.Contains(m.TagId)).Any()
                || (tasksWithNoTag && !i.ItemTagMappings.Any())
            );
        }

        if (tagIds != null && !tagIds.Any())
        {
            results = results.Where(i => !i.ItemTagMappings.Any());
        }

        if (tagIds == null && !tasksWithNoTag)
        {
            results = results.Where(i => i.ItemTagMappings.Any());
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

    public void Clear(int userId)
    {
        var items = _dbContext.Items.Where(i => i.UserId == userId);
        _dbContext.Items.RemoveRange(items);
        _dbContext.SaveChanges();
    }
}