namespace Backend.WebApi.Tests.Repository;

public partial class ItemRepositoryTests
{
    internal static TestData ProjectTestData()
    {
        return new()
        {
            Items = [
                new() { Id = 1, Description = "Task A", UserId = 1, ProjectId = 1},
                new() { Id = 2, Description = "Task B", UserId = 1, ProjectId = 2 },
                new() { Id = 3, Description = "Task C", UserId = 1, ProjectId = null }
            ]
        };
    }

    public static IEnumerable<object[]> ProjectFilterTests()
    {
        return new List<GetItemsCase>
        {
            new()
            {
                UserId = 1, ProjectId = [null],
                ExpectedItemDescriptions = ["Task C"]
            },
            new()
            {
                UserId = 1, ProjectId = [1],
                ExpectedItemDescriptions = ["Task A"]
            },
            new()
            {
                UserId = 1, ProjectId = [2],
                ExpectedItemDescriptions = ["Task B"]
            },
            new()
            {
                UserId = 1, ProjectId = null,
                ExpectedItemDescriptions = ["Task A", "Task B", "Task C"]
            },
            new()
            {
                UserId = 1, ProjectId = [null, 1],
                ExpectedItemDescriptions = ["Task A", "Task C"]
            },
            new()
            {
                UserId = 1, ProjectId = [1, 2],
                ExpectedItemDescriptions = ["Task A", "Task B"]
            }
        }.Select(tc => tc.ToObjectArray());
    }

    [Theory]
    [MemberData(nameof(ProjectFilterTests))]
    public void GetItems_project_filter_tests(
        int userId,
        IEnumerable<bool> completionStatuses,
        IEnumerable<bool> laterStatuses,
        IEnumerable<int>? projectIds,
        int[]? tagIds,
        IEnumerable<string> expectedItemDescriptions)
    {
        var dbContext = CreateTestDB(ProjectTestData());
        ExecuteGetItemTests(dbContext, 
            userId, completionStatuses, laterStatuses, 
            projectIds, tagIds, expectedItemDescriptions);
    }
}