namespace Backend.WebApi.Tests.Repository;

public partial class ItemRepositoryTests
{
    internal static TestData LaterStatusTestData()
    {
        return new()
        {
            Items = [
                new() { Id = 1, Description = "Task A", UserId = 1, Done = false, Later = false },
                new() { Id = 2, Description = "Task B", UserId = 1, Done = false, Later = true },
                new() { Id = 3, Description = "Task C", UserId = 1, Done = false, Later = false }
            ]
        };
    }

    public static IEnumerable<object[]> LaterFilterTests()
    {
        return new List<GetItemsCase>
        {
            new()
            {
                UserId = 1, LaterStatuses = [true],
                ExpectedItemDescriptions = ["Task B"]
            },
            new()
            {
                UserId = 1, LaterStatuses = [false],
                ExpectedItemDescriptions = ["Task A", "Task C"]
            },
            new()
            {
                UserId = 1, LaterStatuses = [true, false],
                ExpectedItemDescriptions = ["Task A", "Task B", "Task C"]
            },
            new()
            {
                UserId = 1, LaterStatuses = [],
                ExpectedItemDescriptions = []
            },
            new()
            {
                UserId = 1, LaterStatuses = null,
                ExpectedItemDescriptions = ["Task A", "Task B", "Task C"]
            }
        }.Select(tc => tc.ToObjectArray());
    }

    [Theory]
    [MemberData(nameof(LaterFilterTests))]
    public void GetItems_later_filter_tests(
        int userId,
        IEnumerable<bool> completionStatuses,
        IEnumerable<bool> laterStatuses,
        IEnumerable<int>? projectIds,
        int[]? tagIds,
        IEnumerable<string> expectedItemDescriptions)
    {
        var dbContext = CreateTestDB(LaterStatusTestData());
        ExecuteGetItemTests(dbContext, 
            userId, completionStatuses, laterStatuses, 
            projectIds, tagIds, expectedItemDescriptions);
    }
}