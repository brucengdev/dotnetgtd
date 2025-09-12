using Backend.Core.Manager;
using Backend.Core.Repository;
using Backend.Core.Tests.Mocks;
using Backend.Models;
using Moq;
using Shouldly;

namespace Backend.Core.Tests;

public partial class ItemManagerTests
{
    [Theory, CombinatorialData]
    public void GetItems_is_successful(
        [CombinatorialValues(1,2,3)]
        int expectedUserId, 
        [CombinatorialValues("", "true,false", "false,true", "true", "false")]
        string completionFilter,
        [CombinatorialValues("", "true,false", "false,true", "true", "false")]
        string laterFilter,
        [CombinatorialValues(null, 10,2,4)]
        int? projectId)
    {
        //arrange
        var completionStatuses = completionFilter.Split(",")
            .Select(f => f == "true");
        var laterStatuses = laterFilter.Split(",")
            .Select(f => f == "true");
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
        var items = sut.GetItems(expectedUserId, 
            completionStatuses, laterStatuses, projectId);

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