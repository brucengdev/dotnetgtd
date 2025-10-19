namespace Backend.WebApi.Tests.Repository;

public partial class ItemRepositoryTests
{
    internal static TestData ActiveWithProjectTestData()
    {
        return new()
        {
            Items = [
                new() { Id = 1, Description = "Inactive task with inactive project",
                    UserId = 1, Later = true, ProjectId = 1 },
                new() { Id = 2, Description = "Active task with inactive project", 
                    UserId = 1, Later = false, ProjectId = 1 },
                new() { Id = 3, Description = "Inactive task with active project",
                    UserId = 1, Later = true, ProjectId = 2 },
                new() { Id = 4, Description = "Active task with active project", 
                    UserId = 1, Later = false, ProjectId = 2 },
            ],
            Projects = [
                new() { Id = 1, Name = "inactive project", Later = true},
                new() { Id = 2, Name = "active project", Later = false},
            ]
        };
    }

    public static IEnumerable<object[]> ActiveWithProjectTests()
    {
        return new List<GetItemsCase>
        {
            new()
            {
                UserId = 1, LaterStatuses = [true],
                ExpectedItemDescriptions = [
                    "Inactive task with inactive project",
                    "Active task with inactive project", 
                    "Inactive task with active project"
                ]
            },
            new()
            {
                UserId = 1, LaterStatuses = [false],
                ExpectedItemDescriptions = [
                    "Active task with active project"
                ]
            },
            new()
            {
                UserId = 1, LaterStatuses = [true, false],
                ExpectedItemDescriptions = [
                    "Inactive task with inactive project",
                    "Active task with inactive project", 
                    "Inactive task with active project",
                    "Active task with active project"
                ]
            },
            new()
            {
                UserId = 1, LaterStatuses = [],
                ExpectedItemDescriptions = []
            },
            new()
            {
                UserId = 1, LaterStatuses = null,
                ExpectedItemDescriptions = [
                    "Inactive task with inactive project",
                    "Active task with inactive project", 
                    "Inactive task with active project",
                    "Active task with active project"
                ]
            }
        }.Select(tc => new object[] { tc });
    }

    [Theory]
    [MemberData(nameof(ActiveWithProjectTests))]
    public void GetItems_active_with_project_tests(GetItemsCase testCase)
    {
        var dbContext = CreateTestDB(ActiveWithProjectTestData());
        ExecuteGetItemTests(dbContext, testCase);
    }
}