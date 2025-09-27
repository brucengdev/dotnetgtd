namespace Backend.WebApi.Tests.Repository;

public partial class ItemRepositoryTests
{
    internal static TestData UserIdTestData()
    {
        return new()
        {
            Items = [
                new() { Id = 1, Description = "Task A", UserId = 1 },
                new() { Id = 2, Description = "Task B", UserId = 2 },
                new() { Id = 3, Description = "Task C", UserId = 3 },
                new() { Id = 4, Description = "Task D", UserId = 1 }
            ]
        };
    }

    public static IEnumerable<object[]> UserFilterTests()
    {
        return new List<GetItemsCase>
        {
            new()
            {
                UserId = 1,
                ExpectedItemDescriptions = ["Task A", "Task D"]
            },
            new()
            {
                UserId = 2,
                ExpectedItemDescriptions = ["Task B"]
            },
            new()
            {
                UserId = 3,
                ExpectedItemDescriptions = ["Task C"]
            }
        }.Select(tc => tc.ToObjectArray());
    }

    [Theory]
    [MemberData(nameof(UserFilterTests))]
    public void GetItems_user_filter_tests(
        int userId,
        IEnumerable<bool> completionStatuses,
        IEnumerable<bool> laterStatuses,
        IEnumerable<int>? projectIds,
        bool tasksWithNoProjects,
        int[]? tagIds,
        bool tasksWithNoTag,
        IEnumerable<string> expectedItemDescriptions)
    {
        var dbContext = CreateTestDB(UserIdTestData());
        ExecuteGetItemTests(dbContext, 
            userId, completionStatuses, laterStatuses, 
            projectIds, tasksWithNoProjects, 
            tagIds, tasksWithNoTag,
            expectedItemDescriptions);
    }
}