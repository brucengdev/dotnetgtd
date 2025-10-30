using Backend.Core.Manager;
using Backend.Core.Tests.Mocks;
using Backend.Models;
using Shouldly;

namespace Backend.Core.Tests;

public class DataManagerTests
{
    [Fact]
    public void Import_must_delete_current_data()
    {
        //arrange
        var data = new TestDataSource();
        data.Items =
        [
            new() { Id = 1, Description = "Task 1", UserId = 12 },
            new() { Id = 2, Description = "Task 2", UserId = 12 },
            new() { Id = 3, Description = "Task 2", UserId = 14 }
        ];
        data.Tags =
        [
            new() { Id = 1, Name = "Tag 1", UserId = 12 },
            new() { Id = 2, Name = "Tag 2", UserId = 12 },
            new() { Id = 3, Name = "Tag 3", UserId = 14 }
        ];
        data.ItemTagMappings =
        [
            new() { Id = 1, ItemId = 1, TagId = 2 },
            new() { Id = 2, ItemId = 3, TagId = 2 }
        ];
        data.Projects =
        [
            new() { Id = 1, Name = "Project 1", UserId = 12 },
            new() { Id = 2, Name = "Project 2", UserId = 12 },
            new() { Id = 3, Name = "Project 3", UserId = 14 }
        ];
        var itemRepo = new TestItemRepository(data);
        var projectRepo = new TestProjectRepository(data);
        var tagRepo = new TestTagRepository(data);
        var sut = new DataManager(
            itemRepo,
            projectRepo,
            tagRepo);
        
        //act
        sut.Import(new(), 12);
        
        //assert
        data.ItemTagMappings.ShouldBe([new()
        {
            Id = 2, ItemId = 3, TagId = 2
        }]);
        data.Items.ShouldBe([
            new() { Id = 3, Description = "Task 2", UserId = 14 }
        ]);
        data.Projects.ShouldBe([
            new() { Id = 3, Name = "Project 3", UserId = 14 }
        ]);
        data.Tags.ShouldBe([
            new() { Id = 3, Name = "Tag 3", UserId = 14 }
        ]);
    }

    [Fact]
    public void ImportData_must_create_projects()
    {
        //arrange
        var data = new TestDataSource();
        var itemRepo = new TestItemRepository(data);
        var projectRepo = new TestProjectRepository(data);
        var tagRepo = new TestTagRepository(data);
        var sut = new DataManager(itemRepo, projectRepo, tagRepo);
        
        //assert
        var userData = new ExportedData()
        {
            Projects =
            [
                new()
                {
                    Id = 12,
                    Name = "Project 1",
                    Description = "Project 1 description",
                    Completed = false,
                    Later = false,
                },
                new()
                {
                    Id = 7,
                    Name = "Project 2",
                    Description = "Project 2 description",
                    Completed = false,
                    Later = true,
                },
                new()
                {
                    Id = 65,
                    Name = "Project 3",
                    Description = "Project 3 description",
                    Completed = true,
                    Later = false,
                },
                new()
                {
                    Id = 33,
                    Name = "Project 4",
                    Description = "Project 4 description",
                    Completed = true,
                    Later = true,
                }
            ]
        };
        sut.Import(userData, 12);
        
        //assert
        data.Projects.ShouldBe([
            new()
            {
                Id = 1,
                Name = "Project 1",
                Done = false,
                Later = false,
                UserId = 12
            },
            new()
            {
                Id = 2,
                Name = "Project 2",
                Done = false,
                Later = true,
                UserId = 12
            },
            new()
            {
                Id = 3,
                Name = "Project 3",
                Done = true,
                Later = false,
                UserId = 12
            },
            new()
            {
                Id = 4,
                Name = "Project 4",
                Done = true,
                Later = true,
                UserId = 12
            }
        ]);
    }
    
    [Fact]
    public void ImportData_must_create_tags()
    {
        //arrange
        var data = new TestDataSource();
        var itemRepo = new TestItemRepository(data);
        var projectRepo = new TestProjectRepository(data);
        var tagRepo = new TestTagRepository(data);
        var sut = new DataManager(itemRepo, projectRepo, tagRepo);
        
        //assert
        var userData = new ExportedData()
        {
            Tags =
            [
                new()
                {
                    Id = 12,
                    Name = "Tag 1",
                },
                new()
                {
                    Id = 13,
                    Name = "Tag 2",
                }
            ]
        };
        sut.Import(userData, 12);
        
        //assert
        data.Tags.ShouldBe([
            new()
            {
                Id = 1,
                Name = "Tag 1",
                UserId = 12
            },
            new()
            {
                Id = 2,
                Name = "Tag 2",
                UserId = 12
            }
        ]);
    }
    
    [Fact]
    public void ImportData_must_create_tasks_with_no_project_and_tags()
    {
        //arrange
        var data = new TestDataSource();
        var itemRepo = new TestItemRepository(data);
        var projectRepo = new TestProjectRepository(data);
        var tagRepo = new TestTagRepository(data);
        var sut = new DataManager(itemRepo, projectRepo, tagRepo);
        
        //assert
        var userData = new ExportedData()
        {
            Tasks = [
                new()
                {
                    Id = 3,
                    Name = "Task 1",
                    Completed = false,
                    Later = false,
                    Description = "Task description",
                    Note = "a note",
                    Pinned = false,
                    Priority = false,
                },
                new()
                {
                    Id = 5,
                    Name = "Task 2",
                    Completed = false,
                    Later = false,
                    Description = "Task description",
                    Note = "a note",
                    Pinned = false,
                    Priority = true,
                },
                new()
                {
                    Id = 8,
                    Name = "Task 3",
                    Completed = false,
                    Later = false,
                    Description = "Task description",
                    Note = "a note",
                    Pinned = true,
                    Priority = false
                },
                new()
                {
                    Id = 54,
                    Name = "Task 4",
                    Completed = false,
                    Later = false,
                    Description = "Task description",
                    Note = "a note",
                    Pinned = true,
                    Priority = true
                }
            ]
        };
        sut.Import(userData, 12);
        
        //assert
        data.Items.ShouldBe([
            new()
            {
                Id = 1,
                Description = "Task 1",
                Done = false,
                Later = false,
                UserId = 12
            },
            new()
            {
                Id = 2,
                Description = "Task 2",
                Done = false,
                Later = false,
                UserId = 12
            },
            new()
            {
                Id = 3,
                Description = "Task 3",
                Done = false,
                Later = false,
                UserId = 12
            },
            new()
            {
                Id = 4,
                Description = "Task 4",
                Done = false,
                Later = false,
                UserId = 12
            }
        ]);
    }
    
    [Fact]
    public void ImportData_must_create_tasks_with_project()
    {
        //arrange
        var data = new TestDataSource();
        var itemRepo = new TestItemRepository(data);
        var projectRepo = new TestProjectRepository(data);
        var tagRepo = new TestTagRepository(data);
        var sut = new DataManager(itemRepo, projectRepo, tagRepo);
        
        //assert
        var userData = new ExportedData()
        {
            Projects = [
                new()
                {
                    Id = 123,
                    Name = "Project 1",
                },
                new()
                {
                    Id = 131,
                    Name = "Project 2",
                }
            ],
            Tasks = [
                new()
                {
                    Id = 3,
                    Name = "Task 1",
                    ProjectId = 131
                }
            ]
        };
        sut.Import(userData, 12);
        
        //assert
        data.Projects.ShouldBe([
            new()
            {
                Id = 1,
                Name = "Project 1",
                UserId = 12
            },
            new()
            {
                Id = 2,
                Name = "Project 2",
                UserId = 12
            }
        ]);
        data.Items.ShouldBe([
            new()
            {
                Id = 1,
                Description = "Task 1",
                UserId = 12,
                ProjectId = 2
            }
        ]);
    }
}