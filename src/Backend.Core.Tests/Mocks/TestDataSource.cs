using Backend.Models;

namespace Backend.Core.Tests.Mocks;

public class TestDataSource
{
    public List<Item> Items { get; set; } = new();
    public List<ItemTagMapping> ItemTagMappings { get; set; } = new();
}