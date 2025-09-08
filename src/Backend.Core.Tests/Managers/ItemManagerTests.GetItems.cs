using Backend.Core.Manager;
using Backend.Core.Repository;
using Backend.Core.Tests.Mocks;
using Backend.Models;
using Moq;
using Shouldly;

namespace Backend.Core.Tests;

public partial class ItemManagerTests
{
    public static IEnumerable<object[]> GetItemsCases =
    [
        [ 123, new List<bool> { }],
        [ 23, new List<bool> { true }],
        [ 25, new List<bool> { false }],
        [ 5, new List<bool> { true, false }],
        [ 10, new List<bool> { false, true }],
    ];
    [Theory]
    [MemberData(nameof(GetItemsCases))]
    public void GetItems_is_successful(int expectedUserId, List<bool> completionStatuses)
    {
        //arrange
        var mockItemRepo = new Mock<IItemRepository>();
        mockItemRepo.Setup(ir => ir.GetItems(expectedUserId, completionStatuses, true))
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
        var items = sut.GetItems(expectedUserId, completionStatuses);

        //assert
        mockItemRepo.Verify(ir => 
            ir.GetItems(expectedUserId, completionStatuses, true), 
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