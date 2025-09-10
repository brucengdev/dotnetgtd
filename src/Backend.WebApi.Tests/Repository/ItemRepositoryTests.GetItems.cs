using Backend.Models;
using Backend.WebApi.Repository;
using Microsoft.EntityFrameworkCore;
using Shouldly;

namespace Backend.WebApi.Tests.Repository;

public partial class ItemRepositoryTests
{
    private List<Item> CreateTestData()
    {
        return
        [
            new()
            {
                Id = 1,
                Description = "Task A",
                Done = true,
                UserId = 1
            },
            new()
            {
                Id = 2,
                Description = "Task B",
                Done = false,
                UserId = 1
            },
            new()
            {
                Id = 3,
                Description = "Task C",
                Done = false,
                UserId = 2
            },
        ];
    }
    public static IEnumerable<object[]> GetItemsCases =
    [
        [ 1, new List<bool>{}, true, new List<string>{"Task A","Task B"}],
        [ 1, new List<bool>{ true, false }, true, new List<string>{"Task A","Task B"}],
        [ 1, new List<bool>{ false, true }, true, new List<string>{"Task A","Task B"}],
        [ 1, new List<bool>{ true }, true, new List<string>{"Task A"}],
        [ 1, new List<bool>{ false }, true, new List<string>{"Task B"}],
    ];

    [Theory]
    [MemberData(nameof(GetItemsCases))]
    public void GetItems_must_return_values(
        int userId,
        List<bool> completionStatuses,
        bool fetchTagMappings,
        List<string> expectedItemDescriptions)
    {
        //arrange
        var dbContextOptionsBuilder = new DbContextOptionsBuilder<GTDContext>();
        dbContextOptionsBuilder.UseInMemoryDatabase(Guid.NewGuid().ToString());
        var dbContext = new GTDContext(dbContextOptionsBuilder.Options);
        var sut = new ItemRepository(dbContext);
        var testData = CreateTestData();
        testData.ForEach(item => dbContext.Items.Add(item));
        dbContext.SaveChanges();

        //act
        var items = sut.GetItems(userId, completionStatuses, [], fetchTagMappings);

        //assert
        items.Count().ShouldBe(expectedItemDescriptions.Count);
        items.Select(i => i.Description)
            .ShouldBe(expectedItemDescriptions);
    }
}