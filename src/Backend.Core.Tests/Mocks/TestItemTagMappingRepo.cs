using Backend.Core.Repository;
using Backend.Models;

namespace Backend.Core.Tests.Mocks;

public class TestItemTagMappingRepo: IItemTagMappingRepo
{
    public List<ItemTagMapping> Mappings { get; set; } = new();
}