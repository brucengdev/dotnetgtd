namespace Backend.WebApi.Tests.Repository;

public partial class ItemRepositoryTests
{
    internal static TestData CompletionWithProjectTestData()
    {
        return new()
        {
            Items = [
                new() { Id = 1, Description = "Uncompleted task with uncompleted project",
                    UserId = 1, Done = false, ProjectId = 1 },
                new() { Id = 2, Description = "Completed task with uncompleted project", 
                    UserId = 1, Done = true, ProjectId = 1 },
                new() { Id = 3, Description = "Uncompleted task with completed project",
                    UserId = 1, Done = false, ProjectId = 2 },
                new() { Id = 4, Description = "Completed task with completed project", 
                    UserId = 1, Done = true, ProjectId = 2 },
            ],
            Projects = [
                new() { Id = 1, Name = "uncompleted project", Done = false},
                new() { Id = 2, Name = "completed project", Done = true},
            ]
        };
    }

    public static IEnumerable<object[]> CompletionWithProjectTests()
    {
        return new List<GetItemsCase>
        {
            new()
            {
                UserId = 1, CompletionStatuses = [true],
                ExpectedItemDescriptions = [
                    "Completed task with uncompleted project",
                    "Completed task with completed project"
                ]
            },
            // new()
            // {
            //     UserId = 1, CompletionStatuses = [false],
            //     ExpectedItemDescriptions = [
            //         "Uncompleted task with uncompleted project",
            //     ]
            // },
            // new()
            // {
            //     UserId = 1, CompletionStatuses = [true, false],
            //     ExpectedItemDescriptions = [
            //         "Uncompleted task with uncompleted project",
            //         "Completed task with uncompleted project", 
            //         "Uncompleted task with completed project",
            //         "Completed task with completed project"
            //     ]
            // },
            // new()
            // {
            //     UserId = 1, CompletionStatuses = [],
            //     ExpectedItemDescriptions = []
            // },
            // new()
            // {
            //     UserId = 1, CompletionStatuses = null,
            //     ExpectedItemDescriptions = [
            //         "Uncompleted task with uncompleted project",
            //         "Completed task with uncompleted project", 
            //         "Uncompleted task with completed project",
            //         "Completed task with completed project"
            //     ]
            // }
        }.Select(tc => new object[] { tc });
    }

    [Theory]
    [MemberData(nameof(CompletionWithProjectTests))]
    public void GetItems_completion_with_project_tests(GetItemsCase testCase)
    {
        var dbContext = CreateTestDB(CompletionWithProjectTestData());
        ExecuteGetItemTests(dbContext, testCase);
    }
}