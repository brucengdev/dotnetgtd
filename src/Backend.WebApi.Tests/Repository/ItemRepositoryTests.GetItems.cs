using Backend.Models;
using Backend.WebApi.Repository;
using Microsoft.EntityFrameworkCore;
using Shouldly;

namespace Backend.WebApi.Tests.Repository;

class GetItemsCase
{
    public int UserId;
    public IEnumerable<bool> CompletionStatuses;
    public IEnumerable<bool> LaterStatuses;
    public int? ProjectId;
    public int[]? TagIds;
    public IEnumerable<string> ExpectedItemDescriptions;

    public object[] ToObjectArray() =>
    [
        UserId, CompletionStatuses, LaterStatuses, 
        ProjectId, TagIds, ExpectedItemDescriptions
    ];
}

class TestData
{
    public List<Item> Items;
    public List<Tag> Tags;
    public List<ItemTagMapping> ItemTagMappings;
}

public partial class ItemRepositoryTests
{
    private TestData CreateTestData()
    {
        return new()
        {
            Items =
            [
                new()
                {
                    Id = 1,
                    Description = "Task A",
                    Done = true,
                    UserId = 1,
                    Later = true,
                    ProjectId = 12
                },
                new()
                {
                    Id = 2,
                    Description = "Task B",
                    Done = false,
                    UserId = 1,
                    Later = false,
                },
                new()
                {
                    Id = 3,
                    Description = "Task C",
                    Done = false,
                    UserId = 2
                },
                new()
                {
                    Id = 4,
                    Description = "Task D",
                    Done = false,
                    UserId = 1,
                    ProjectId = 12
                }
            ],
            Tags =
            [
                new() { Id = 1, Name = "TagA", UserId = 1 },
                new() { Id = 2, Name = "TagB", UserId = 1 },
                new() { Id = 3, Name = "TagC", UserId = 1 }
            ],
            ItemTagMappings =
            [
                new() { Id = 1, ItemId = 2, TagId = 2 },
                new() { Id = 2, ItemId = 4, TagId = 3 }
            ]
        };
    }
    public static IEnumerable<object[]> GetItemsCases = new List<GetItemsCase>
    {
        new() { 
            UserId = 1, 
            CompletionStatuses = [], LaterStatuses = [], 
            ExpectedItemDescriptions = [ "Task A","Task B", "Task D"]
        },
        new() { 
            UserId = 1, 
            CompletionStatuses = [ true, false ], LaterStatuses = [],
             ExpectedItemDescriptions = [ "Task A","Task B", "Task D"]
        },
        new() { 
            UserId = 1, 
            CompletionStatuses = [ false, true ], LaterStatuses = [], 
            ExpectedItemDescriptions = [ "Task A","Task B", "Task D" ]
        },
        new() {
            UserId = 1, 
            CompletionStatuses = [ true ], LaterStatuses = [],
            ExpectedItemDescriptions = [ "Task A"]
        },
        new() {
            UserId = 1,
            CompletionStatuses = [ false ], LaterStatuses = [],
            ExpectedItemDescriptions = [ "Task B", "Task D"]
        },
        new() {
            UserId = 1, 
            CompletionStatuses = [], LaterStatuses = [ true, false ],
            ExpectedItemDescriptions = [ "Task A", "Task B", "Task D" ]
        },
        new() {
            UserId = 1, 
            CompletionStatuses = [], LaterStatuses = [ true ],
            ExpectedItemDescriptions = [ "Task A" ]
        },
        new() {
            UserId = 1,
            CompletionStatuses = [], LaterStatuses = [ false ],
            ExpectedItemDescriptions = [ "Task B", "Task D" ]
        },
        new() {
            UserId = 1, 
            CompletionStatuses = [true], LaterStatuses = [ true ],
            ExpectedItemDescriptions = [ "Task A" ]
        },
        new() {
            UserId = 1, 
            CompletionStatuses = [false], LaterStatuses = [ false ],
            ExpectedItemDescriptions = [ "Task B", "Task D" ]
        },
        new() {
            UserId = 1, 
            CompletionStatuses = [true], LaterStatuses = [ false ],
            ExpectedItemDescriptions = [ ]
        },
        new() {
            UserId = 1, 
            CompletionStatuses = [], LaterStatuses = [],
            ProjectId = 12,
            ExpectedItemDescriptions = ["Task A", "Task D"]
        },
        new() {
            UserId = 2, 
            CompletionStatuses = [], LaterStatuses = [],
            ExpectedItemDescriptions = ["Task C"]
        },
        new()
        {
            UserId = 1,
            CompletionStatuses = [], LaterStatuses = [],
            TagIds = [ 2, 3 ],
            ExpectedItemDescriptions = ["Task B", "Task D"]
        },
        new()
        {
            UserId = 1,
            CompletionStatuses = [], LaterStatuses = [],
            TagIds = [ 2 ],
            ExpectedItemDescriptions = ["Task B"]
        },
        new()
        {
            UserId = 1,
            CompletionStatuses = [], LaterStatuses = [],
            TagIds = [ 3 ],
            ExpectedItemDescriptions = ["Task D"]
        },
        new()
        {
            UserId = 1,
            CompletionStatuses = [], LaterStatuses = [],
            TagIds = [ 4 ],
            ExpectedItemDescriptions = []
        }
    }.Select(tc => tc.ToObjectArray());

    [Theory]
    [MemberData(nameof(GetItemsCases))]
    public void GetItems_must_return_values(
        int userId,
        IEnumerable<bool> completionStatuses,
        IEnumerable<bool> laterStatuses,
        int? projectId,
        int[]? tagIds,
        IEnumerable<string> expectedItemDescriptions)
    {
        //arrange
        var dbContext = Utils.CreateTestDB();
        var sut = new ItemRepository(dbContext);
        var testData = CreateTestData();
        testData.Items.ForEach(item => dbContext.Items.Add(item));
        testData.Tags.ForEach(tag => dbContext.Tags.Add(tag));
        testData.ItemTagMappings.ForEach(mapping =>  dbContext.ItemTagMappings.Add(mapping));
        dbContext.SaveChanges();

        //act
        var items = sut.GetItems(userId, completionStatuses, 
            laterStatuses, projectId, tagIds);

        //assert
        items.Select(i => i.Description)
            .ShouldBe(expectedItemDescriptions, 
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
        var result = sut.GetItems(1, [], [], null, []);
        
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