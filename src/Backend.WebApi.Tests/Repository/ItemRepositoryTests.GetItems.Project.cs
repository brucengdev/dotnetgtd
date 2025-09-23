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
                UserId = 1, ProjectId = [], TasksWithNoProjects = true,
                ExpectedItemDescriptions = ["Task C"]
            },
            new()
            {
                UserId = 1, ProjectId = [1], TasksWithNoProjects = false,
                ExpectedItemDescriptions = ["Task A"]
            },
            new()
            {
                UserId = 1, ProjectId = [2], TasksWithNoProjects = false,
                ExpectedItemDescriptions = ["Task B"]
            },
            new()
            {
                UserId = 1, ProjectId = null, TasksWithNoProjects = true,
                ExpectedItemDescriptions = ["Task A", "Task B", "Task C"]
            },
            new()
            {
                UserId = 1, ProjectId = [1], TasksWithNoProjects = true,
                ExpectedItemDescriptions = ["Task A", "Task C"]
            },
            new()
            {
                UserId = 1, ProjectId = [1, 2], TasksWithNoProjects = false,
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
        bool tasksWithNoProjects,
        int[]? tagIds,
        IEnumerable<string> expectedItemDescriptions)
    {
        var dbContext = CreateTestDB(ProjectTestData());
        ExecuteGetItemTests(dbContext, 
            userId, completionStatuses, laterStatuses, 
            projectIds, tasksWithNoProjects, tagIds, expectedItemDescriptions);
    }
}