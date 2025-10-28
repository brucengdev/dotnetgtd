using Backend.Core.Manager;
using Backend.Core.Tests.Mocks;
using Shouldly;

namespace Backend.Core.Tests;

public class DataManagerTests
{
    [Fact]
    public void Import_must_delete_current_data()
    {
        //arrange
        var data = new TestDataSource();
        data.Items =
        [
            new() { Id = 1, Description = "Task 1", UserId = 12 },
            new() { Id = 2, Description = "Task 2", UserId = 12 }
        ];
        data.Tags =
        [
            new() { Id = 1, Name = "Tag 1", UserId = 12 },
            new() { Id = 2, Name = "Tag 2", UserId = 12 }
        ];
        data.ItemTagMappings =
        [
            new() { Id = 1, ItemId = 1, TagId = 2 },
            new() { Id = 2, ItemId = 3, TagId = 2 }
        ];
        data.Projects =
        [
            new() { Id = 1, Name = "Project 1", UserId = 12 },
            new() { Id = 2, Name = "Project 2", UserId = 12 }
        ];
        var itemRepo = new TestItemRepository(data);
        var sut = new DataManager(itemRepo);
        
        //act
        sut.Import(new(), 12);
        
        //assert
        data.ItemTagMappings.ShouldBeEmpty();
        data.Items.ShouldBeEmpty();
        data.Projects.ShouldBeEmpty();
        data.Tags.ShouldBeEmpty();
    }
}