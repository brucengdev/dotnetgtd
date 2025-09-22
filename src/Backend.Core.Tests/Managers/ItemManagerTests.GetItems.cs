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
        [CombinatorialValues(null, "*", "", "true,false", "false,true", "true", "false")]
        string? completionFilter,
        [CombinatorialValues(null, "*", "", "true,false", "false,true", "true", "false")]
        string? laterFilter,
        [CombinatorialValues(null, "", "10","2","4,2")]
        string? projectFilter,
        [CombinatorialValues(true, false)]
        bool tasksWithNoProject,
        [CombinatorialValues(null, "", "*", "1", "2", "1,2,3")]
        string? tagIdFilter
        )
    {
        //arrange
        IEnumerable<bool> completionStatuses;
        if (completionFilter == null || completionFilter == "*")
        {
            completionStatuses = [true, false];
        }else if (completionFilter == "")
        {
            completionStatuses = [];
        }
        else 
        {
            completionStatuses = completionFilter.Split(",").Select(f => f == "completed");
        }
        IEnumerable<bool> laterStatuses = [];
        if (laterFilter == null || laterFilter == "*")
        {
            laterStatuses = [true, false];
        } else if (laterFilter == "")
        {
            laterStatuses = [];
        } else
        {
            laterStatuses = laterFilter.Split(",").Select(f => f == "later");
        }

        IEnumerable<int>? projectIds;
        if (projectFilter == null)
        {
            projectIds = null;
        } else if (projectFilter == "")
        {
            projectIds = [];
        }
        else
        {
            projectIds = projectFilter.Split(",").Select(f => Convert.ToInt32(f));
        }

        IEnumerable<int>? tagIds;
        if (tagIdFilter == null || tagIdFilter == "*")
        {
            tagIds = null;
        } else if (tagIdFilter == "")
        {
            tagIds = [];
        }
        else
        {
            tagIds = tagIdFilter.Split(",").Select(t => Convert.ToInt32(t));
        }

        var mockItemRepo = new Mock<IItemRepository>();
        mockItemRepo.Setup(ir => ir.GetItems(expectedUserId, 
                completionStatuses, laterStatuses, 
                projectIds, tasksWithNoProject, tagIds))
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
            completionStatuses, laterStatuses, projectIds, tasksWithNoProject, tagIds);

        //assert
        mockItemRepo.Verify(ir => 
            ir.GetItems(expectedUserId, completionStatuses,laterStatuses,
                projectIds, tasksWithNoProject, tagIds), 
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