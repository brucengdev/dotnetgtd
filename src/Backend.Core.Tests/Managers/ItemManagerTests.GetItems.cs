using Backend.Core.Manager;
using Backend.Core.Repository;
using Backend.Core.Tests.Mocks;
using Backend.Models;
using Moq;
using Shouldly;

namespace Backend.Core.Tests;

class GetItemTestCase
{
    public int UserId;
    public IEnumerable<bool> CompletionStatuses;
    public IEnumerable<bool> LaterStatuses;
    public int? ProjectId;

    public object[] ToObjectArray()
    {
        return
        [
            UserId, CompletionStatuses, LaterStatuses, ProjectId
        ];
    }
}

public partial class ItemManagerTests
{
    public static IEnumerable<object[]> GetItemsCases = new List<GetItemTestCase>()
    {
        new() {
            UserId = 123, 
            CompletionStatuses = [ ], LaterStatuses = [true, false]
        },
        new() {
            UserId = 23, 
            CompletionStatuses = [ true ], LaterStatuses = [false, true]
        },
        new() {
            UserId = 25, 
            CompletionStatuses = [ false ], LaterStatuses = [true]
        },
        new() {
            UserId = 5, 
            CompletionStatuses = [ true, false ], LaterStatuses = [false],
            ProjectId = 4
        },
        new() {
            UserId = 10, 
            CompletionStatuses = [ false, true ], LaterStatuses = [],
            ProjectId = 11
        },
        new() {
            UserId = 10, 
            CompletionStatuses = [], LaterStatuses = [],
            ProjectId = 12
        },
    }.Select(tc => tc.ToObjectArray());
    
    [Theory]
    [MemberData(nameof(GetItemsCases))]
    public void GetItems_is_successful(int expectedUserId, 
        IEnumerable<bool> completionStatuses,
        IEnumerable<bool> laterStatuses,
        int? projectId)
    {
        //arrange
        var mockItemRepo = new Mock<IItemRepository>();
        mockItemRepo.Setup(ir => ir.GetItems(expectedUserId, 
                completionStatuses, laterStatuses, 
                projectId, true))
            .Returns([
                new()
                {
                    Id = 1,
                    Description = "Task A",
                    UserId = expectedUserId,
                    ItemTagMappings = [
                        new(){ Id = 1, ItemId = 1, TagId = 1}
                    ],
                    Done = true,
                    ProjectId = 1,
                    Later = false
                }
            ]);
        var mockItemTagMappingRepo = new Mock<IItemTagMappingRepo>();
        var sut = new ItemManager(mockItemRepo.Object, 
            new Mock<IUserRepository>().Object,
            mockItemTagMappingRepo.Object);

        //act
        var items = sut.GetItems(expectedUserId, completionStatuses, laterStatuses, projectId);

        //assert
        mockItemRepo.Verify(ir => 
            ir.GetItems(expectedUserId, completionStatuses,laterStatuses, projectId, true), 
            Times.Once);
        mockItemRepo.VerifyNoOtherCalls();
        items.ShouldBe([
            new()
            {
                Id = 1,
                Description = "Task A",
                UserId = expectedUserId,
                TagIds = [1],
                Done = true,
                ProjectId = 1,
                Later = false
            }
        ]);
    }
}