using Backend.Core.Manager;
using Backend.Core.Tests.Mocks;
using Shouldly;

namespace Backend.Core.Tests;

public class DataManagerTests
{
    public void Import_must_delete_current_data()
    {
        //arrange
        var data = new TestDataSource();
        var itemRepo = new TestItemRepository(data);
        var sut = new DataManager(itemRepo);
        
        //act
        sut.Import(new(), 12);
        
        //assert
        data.Items.ShouldBeEmpty();
        data.ItemTagMappings.ShouldBeEmpty();
        data.Projects.ShouldBeEmpty();
        data.Tags.ShouldBeEmpty();
    }
}