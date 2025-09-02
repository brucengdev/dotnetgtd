using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Core.Repository;

public class ItemTagMappingRepo: IItemTagMappingRepo
{
    private GTDContext _dbContext;
    public ItemTagMappingRepo(GTDContext dbContext)
    {
        _dbContext = dbContext;
    }
    public int CreateMapping(ItemTagMapping mapping)
    {
        _dbContext.ItemTagMappings.Add(mapping);
        _dbContext.SaveChanges();
        return mapping.Id;
    }

    public void DeleteByItemId(int itemId)
    {
        var mappings = _dbContext.ItemTagMappings.Where(m => m.ItemId == itemId);
        _dbContext.ItemTagMappings.RemoveRange(mappings);
        _dbContext.SaveChanges();
    }
}