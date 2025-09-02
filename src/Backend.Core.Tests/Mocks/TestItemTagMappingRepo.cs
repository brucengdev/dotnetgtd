using Backend.Core.Repository;
using Backend.Models;

namespace Backend.Core.Tests.Mocks;

public class TestItemTagMappingRepo: IItemTagMappingRepo
{
    public List<ItemTagMapping> Mappings { get; set; } = new();
    public int CreateMapping(ItemTagMapping mapping)
    {
        mapping.Id = Mappings.Count + 1;
        Mappings.Add(mapping);
        return mapping.Id;
    }

    public void DeleteByItemId(int itemId)
    {
        Mappings.RemoveAll(m => m.ItemId == itemId);
    }
}