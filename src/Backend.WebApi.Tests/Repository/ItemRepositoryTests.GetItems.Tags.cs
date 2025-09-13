namespace Backend.WebApi.Tests.Repository;

public partial class ItemRepositoryTests
{
    internal static TestData TagTestData()
    {
        return new()
        {
            Items = [
                new() { Id = 1, Description = "Task A", UserId = 1 },
                new() { Id = 2, Description = "Task B", UserId = 1 },
                new() { Id = 3, Description = "Task C", UserId = 1 },
                new() { Id = 4, Description = "Task D", UserId = 1 }
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
                UserId = 1, TagIds = null,
                ExpectedItemDescriptions = ["Task A", "Task B", "Task C", "Task D"]
            },
            new()
            {
                UserId = 1, TagIds = [1],
                ExpectedItemDescriptions = ["Task A", "Task D"]
            },
            new()
            {
                UserId = 1, TagIds = [2],
                ExpectedItemDescriptions = ["Task A"]
            },
            new()
            {
                UserId = 1, TagIds = [1, 2],
                ExpectedItemDescriptions = ["Task A", "Task D"]
            },
            new()
            {
                UserId = 1, TagIds = [],
                ExpectedItemDescriptions = ["Task B", "Task C"]
            }
        }.Select(tc => tc.ToObjectArray());
    }

    [Theory]
    [MemberData(nameof(TagFilterTests))]
    public void GetItems_tag_filter_tests(
        int userId,
        IEnumerable<bool> completionStatuses,
        IEnumerable<bool> laterStatuses,
        IEnumerable<int?>? projectIds,
        int[]? tagIds,
        IEnumerable<string> expectedItemDescriptions)
    {
        var dbContext = CreateTestDB(TagTestData());
        ExecuteGetItemTests(dbContext, 
            userId, completionStatuses, laterStatuses, 
            projectIds, tagIds, expectedItemDescriptions);
    }
}