using Backend.Models;

namespace Backend.Core.Repository;

public interface IItemTagMappingRepo
{
    public int CreateMapping(ItemTagMapping mapping);
}