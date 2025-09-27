using Backend.Core.Manager;
using Backend.Core.Repository;
using Backend.Core.Tests.Mocks;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Moq;
using Shouldly;

namespace Backend.Core.Tests;

public partial class ProjectManagerTests
{
    [Theory, CombinatorialData]
    public void GetProjects_must_be_successful(
            [CombinatorialValues(2,3)]
            int userId,
            [CombinatorialValues(null, "", "true", "false", "true,false", "false,true")]
            string? completionFilter,
            [CombinatorialValues(null, "", "true", "false", "true,false", "false,true")]
            string? laterFilter
        )
    {
        //arrange
        var userRepo = new TestUserRepository();
        userRepo.AddUser(new User
        {
            Id = 123,
            PasswordHash = AccountManagerTests.HashPassword("pass"),
            Username = "user1"
        });
        var projectRepo = new Mock<IProjectRepository>();
        IEnumerable<bool>? completionStatuses = null;
        if (completionFilter == "")
        {
            completionStatuses = [];
        }else if (completionFilter != null)
        {
            completionStatuses = completionFilter.Split(',').Select(v => v == "true");
        }
        
        IEnumerable<bool>? laterStatuses = null;
        if (laterFilter == "")
        {
            laterStatuses = [];
        }else if (laterFilter != null)
        {
            laterStatuses = laterFilter.Split(',').Select(v => v == "true");
        }
        
        projectRepo.Setup(pr => pr.GetProjects(userId, completionStatuses, laterStatuses))
            .Returns(new List<Project>
            {
                new() { Id = 1, Name = "Project A", UserId = 123, Later = true },
                new() { Id = 3, Name = "Project C", UserId = 123, Later = false }
            });
        var sut = new ProjectManager(projectRepo.Object, userRepo);
        
        //act
        var projects = sut.GetProjects(userId, completionStatuses, laterStatuses);
        
        //assert
        projects.ShouldBe(new List<Project>
        {
            new() { Id = 1, Name = "Project A", UserId = 123, Later = true },
            new() { Id = 3, Name = "Project C", UserId = 123, Later = false }
        });
    } 
}