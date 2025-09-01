using Backend.Models;

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
}