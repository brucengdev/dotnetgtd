using Backend.Core.Tests.Mocks;

namespace Backend.Core.Tests;

public class TestBase
{
    protected TestDataSource Data { get; }
    public TestBase()
    {
        Data = new TestDataSource();
    }
}