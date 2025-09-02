using Backend.Core.Repository;
using Backend.Models;

namespace Backend.Core.Tests.Mocks;

public class TestItemTagMappingRepo: IItemTagMappingRepo
{
    private TestDataSource _data;

    public TestItemTagMappingRepo(TestDataSource data)
    {
        _data = data;
    }
    public int CreateMapping(ItemTagMapping mapping)
    {
        mapping.Id = _data.ItemTagMappings.Count + 1;
        _data.ItemTagMappings.Add(mapping);
        return mapping.Id;
    }

    public void DeleteByItemId(int itemId)
    {
        _data.ItemTagMappings.RemoveAll(m => m.ItemId == itemId);
    }
}