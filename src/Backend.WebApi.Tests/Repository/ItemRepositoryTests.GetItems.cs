using Backend.Models;
using Backend.WebApi.Repository;
using Microsoft.EntityFrameworkCore;
using Shouldly;

namespace Backend.WebApi.Tests.Repository;

public class GetItemsCase
{
    public int UserId;
    public IEnumerable<bool> CompletionStatuses;
    public IEnumerable<bool> LaterStatuses;
    public IEnumerable<int>? ProjectId;
    public bool TasksWithNoProjects = true;
    public int[]? TagIds;
    public bool TasksWithNoTags = true;
    public IEnumerable<string> ExpectedItemDescriptions;

    public object[] ToObjectArray()
    {
        return
        [
            UserId, CompletionStatuses, LaterStatuses,
            ProjectId, TasksWithNoProjects, 
            TagIds, TasksWithNoTags,
            ExpectedItemDescriptions
        ];
    }
}

class TestData
{
    public List<Item> Items = [];
    public List<Tag> Tags = [];
    public List<ItemTagMapping> ItemTagMappings = [];
}

public partial class ItemRepositoryTests
{

    private static GTDContext CreateTestDB(TestData testData)
    {
        var dbContext = Utils.CreateTestDB();
        testData.Items.ForEach(item => dbContext.Items.Add(item));
        testData.Tags.ForEach(tag => dbContext.Tags.Add(tag));
        testData.ItemTagMappings.ForEach(mapping =>  dbContext.ItemTagMappings.Add(mapping));
        dbContext.SaveChanges();
        return dbContext;
    }

    private void ExecuteGetItemTests(GTDContext dbContext, GetItemsCase testCase)
    {
        //arrange
        var sut = new ItemRepository(dbContext);

        //act
        var items = sut.GetItems(testCase.UserId, 
            testCase.CompletionStatuses, testCase.LaterStatuses, 
            testCase.ProjectId, testCase.TasksWithNoProjects, 
            testCase.TagIds, testCase.TasksWithNoTags);

        //assert
        items.Select(i => i.Description)
            .ShouldBe(testCase.ExpectedItemDescriptions, 
                "Actual: " + string.Join(',', items.Select(i => i.Description).ToList()));
    }

    [Fact]
    public void GetItems_Must_fetch_related_entities()
    {
        //arrange
        var dbContext = Utils.CreateTestDB();
        dbContext.Items.Add(new()
        {
            Id = 1,
            Description = "Test task",
            UserId = 1
        });
        dbContext.Users.Add(new()
        {
            Id = 1,
            Username = "testuser",
            PasswordHash = "testhash"
        });
        dbContext.Tags.Add(new() { Id = 1, Name = "TagA", UserId = 1 });
        dbContext.ItemTagMappings.Add(new() { Id = 1, TagId = 1, ItemId = 1 });
        dbContext.SaveChanges();
        
        //act
        var sut = new ItemRepository(dbContext);
        var result = sut.GetItems(1);
        
        //assert
        result.ShouldBe([
            new ()
            {
                Id = 1,
                Description = "Test task",
                UserId = 1,
                ItemTagMappings = [
                    new() { Id = 1, TagId = 1, ItemId = 1 }
                ],
                User = new()
                {
                    Id = 1,
                    Username = "testuser",
                    PasswordHash = "testhash"
                }
            }
        ]);
    }
}