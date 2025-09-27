namespace Backend.WebApi.Tests.Repository;

public partial class ItemRepositoryTests
{
    internal static TestData TagTestData()
    {
        return new()
        {
            Items = [
                new() { Id = 1, Description = "Task with Tag AB", UserId = 1 },
                new() { Id = 2, Description = "Task with no tag 1", UserId = 1 },
                new() { Id = 3, Description = "Task with no tag 2", UserId = 1 },
                new() { Id = 4, Description = "Task with Tag A", UserId = 1 }
            ],
            Tags = [
                new() {Id = 1, UserId = 1, Name = "Tag A" },
                new() {Id = 2, UserId = 1, Name = "Tag B" }
            ],
            ItemTagMappings = [
                new() {Id = 1, ItemId = 1, TagId = 1},
                new() {Id = 2, ItemId = 1, TagId = 2},
                new() {Id = 3, ItemId = 4, TagId = 1}
            ]
        };
    }

    public static IEnumerable<object[]> TagFilterTests()
    {
        return new List<GetItemsCase>
        {
            new()
            {
                UserId = 1, TagIds = null, TasksWithNoTags = true,
                ExpectedItemDescriptions = ["Task with Tag AB", "Task with no tag 1", "Task with no tag 2", "Task with Tag A"]
            },
            new()
            {
                UserId = 1, TagIds = [1], TasksWithNoTags = false,
                ExpectedItemDescriptions = ["Task with Tag AB", "Task with Tag A"]
            },
            new()
            {
                UserId = 1, TagIds = [2], TasksWithNoTags = false,
                ExpectedItemDescriptions = ["Task with Tag AB"]
            },
            new()
            {
                UserId = 1, TagIds = [1, 2], TasksWithNoTags = false,
                ExpectedItemDescriptions = ["Task with Tag AB", "Task with Tag A"]
            },
            new()
            {
                UserId = 1, TagIds = [], TasksWithNoTags = true,
                ExpectedItemDescriptions = ["Task with no tag 1", "Task with no tag 2"]
            },
            new()
            {
                UserId = 1, TagIds = [2], TasksWithNoTags = true,
                ExpectedItemDescriptions = ["Task with Tag AB", "Task with no tag 1", "Task with no tag 2"]
            },
        }.Select(tc => tc.ToObjectArray());
    }

    [Theory]
    [MemberData(nameof(TagFilterTests))]
    public void GetItems_tag_filter_tests(
        int userId,
        IEnumerable<bool> completionStatuses,
        IEnumerable<bool> laterStatuses,
        IEnumerable<int>? projectIds,
        bool tasksWithNoProjects,
        int[]? tagIds,
        bool tasksWithNoTag,
        IEnumerable<string> expectedItemDescriptions)
    {
        var dbContext = CreateTestDB(TagTestData());
        ExecuteGetItemTests(dbContext, 
            userId, completionStatuses, laterStatuses, 
            projectIds, tasksWithNoProjects,
            tagIds, expectedItemDescriptions);
    }
}