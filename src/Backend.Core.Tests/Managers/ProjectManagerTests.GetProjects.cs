using Backend.Core.Manager;
using Backend.Core.Tests.Mocks;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Shouldly;

namespace Backend.Core.Tests;

public partial class ProjectManagerTests
{
    [Fact]
    public void GetProjects_must_be_successful()
    {
        //arrange
        var userRepo = new TestUserRepository();
        userRepo.AddUser(new User
        {
            Id = 123,
            PasswordHash = AccountManagerTests.HashPassword("pass"),
            Username = "user1"
        });
        var projectRepo = new TestProjectRepository();
        projectRepo.Projects = new List<Project>
        {
            new() { Id = 1, Name = "Project A", UserId = 123, Later = true },
            new() { Id = 2, Name = "Project B", UserId = 456 },
            new() { Id = 3, Name = "Project C", UserId = 123, Later = false },
            new() { Id = 4, Name = "Project D", UserId = 111 },
            new() { Id = 5, Name = "Project E", UserId = 23 }
        };
        var sut = new ProjectManager(projectRepo, userRepo);
        
        //act
        var projects = sut.GetProjects(123);
        
        //assert
        projects.ShouldBe(new List<Project>
        {
            new() { Id = 1, Name = "Project A", UserId = 123, Later = true },
            new() { Id = 3, Name = "Project C", UserId = 123, Later = false }
        });
    } 
}