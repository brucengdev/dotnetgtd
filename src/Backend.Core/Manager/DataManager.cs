using Backend.Core.Repository;
using Backend.Models;

namespace Backend.Core.Manager;

public class DataManager:IDataManager
{
    private readonly IItemRepository _itemRepository;
    private readonly IProjectRepository _projectRepo;
    private readonly ITagRepository _tagRepo;
    public DataManager(
        IItemRepository itemRepo,
        IProjectRepository projectRepo,
        ITagRepository tagRepo)
    {
        _itemRepository = itemRepo;
        _projectRepo = projectRepo;
        _tagRepo = tagRepo;
    }
    public void Import(ExportedData data, int userId)
    {
        //clear data
        _itemRepository.Clear(userId);
        _projectRepo.Clear(userId);
        _tagRepo.Clear(userId);
        
        //import data
        ImportProjects(data, userId);
        ImportTags(data, userId);
    }

    private void ImportTags(ExportedData data, int userId)
    {
        foreach (var exportedTag in data.Tags ?? [])
        {
            var tag = new Tag()
            {
                Name = exportedTag.Name,
                UserId = userId
            };
            _tagRepo.CreateTag(tag);
        }
    }

    private void ImportProjects(ExportedData data, int userId)
    {
        foreach (var exportedProject in data.Projects ?? [])
        {
            var project = new Project()
            {
                Name = exportedProject.Name,
                Done = exportedProject.Completed,
                Later = exportedProject.Later,
                UserId = userId
            };
            _projectRepo.CreateProject(project);
        }
    }
}