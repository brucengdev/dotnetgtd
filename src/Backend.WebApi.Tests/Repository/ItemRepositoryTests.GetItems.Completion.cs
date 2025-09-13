namespace Backend.WebApi.Tests.Repository;

public partial class ItemRepositoryTests
{
    internal static TestData CompletionTestData()
    {
        return new()
        {
            Items = [
                new() { Id = 1, Description = "Task A", UserId = 1, Done = false, Later = false },
                new() { Id = 2, Description = "Task B", UserId = 1, Done = true, Later = false },
                new() { Id = 3, Description = "Task C", UserId = 1, Done = false, Later = false }
            ]
        };
    }

    public static IEnumerable<object[]> CompletionFilterTests()
    {
        return new List<GetItemsCase>
        {
            new()
            {
                UserId = 1, CompletionStatuses = [true], LaterStatuses = [true, false],
                ExpectedItemDescriptions = ["Task B"]
            },
            new()
            {
                UserId = 1, CompletionStatuses = [false], LaterStatuses = [true, false],
                ExpectedItemDescriptions = ["Task A", "Task C"]
            },
            new()
            {
                UserId = 1, CompletionStatuses = [true, false], LaterStatuses = [true, false],
                ExpectedItemDescriptions = ["Task A", "Task B", "Task C"]
            },
            new()
            {
                UserId = 1, CompletionStatuses = [], LaterStatuses = [true, false],
                ExpectedItemDescriptions = []
            },
            new()
            {
                UserId = 1, CompletionStatuses = null, LaterStatuses = [true, false],
                ExpectedItemDescriptions = ["Task A", "Task B", "Task C"]
            }
        }.Select(tc => tc.ToObjectArray());
    }

    [Theory]
    [MemberData(nameof(CompletionFilterTests))]
    public void GetItems_completion_filter_tests(
        int userId,
        IEnumerable<bool> completionStatuses,
        IEnumerable<bool> laterStatuses,
        int[]? projectIds,
        int[]? tagIds,
        IEnumerable<string> expectedItemDescriptions)
    {
        var dbContext = CreateTestDB(CompletionTestData());
        ExecuteGetItemTests(dbContext, 
            userId, completionStatuses, laterStatuses, 
            projectIds, tagIds, expectedItemDescriptions);
    }
}