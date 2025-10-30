using Backend.Core.Repository;
using Backend.Models;

namespace Backend.Core.Manager;

public class DataManager:IDataManager
{
    private readonly IItemRepository _itemRepository;
    private readonly IProjectRepository _projectRepo;
    private readonly ITagRepository _tagRepo;
    private readonly IItemTagMappingRepo _itemTagMappingRepo;
    public DataManager(
        IItemRepository itemRepo,
        IProjectRepository projectRepo,
        ITagRepository tagRepo,
        IItemTagMappingRepo itemTagMappingRepo)
    {
        _itemRepository = itemRepo;
        _projectRepo = projectRepo;
        _tagRepo = tagRepo;
        _itemTagMappingRepo = itemTagMappingRepo;
    }
    public void Import(ExportedData data, int userId)
    {
        //clear data
        _itemRepository.Clear(userId);
        _projectRepo.Clear(userId);
        _tagRepo.Clear(userId);
        
        //import data
        var projectIdMap = ImportProjects(data, userId);
        var tagIdMap = ImportTags(data, userId);
        ImportTasks(data, projectIdMap, tagIdMap, userId);
    }

    private void ImportTasks(
        ExportedData data, 
        Dictionary<int, int> projectIdMap, 
        Dictionary<int, int> tagIdMap,
        int userId)
    {
        foreach (var exportedTask in data.Tasks ?? [])
        {
            int? projectId = null;
            if (exportedTask.ProjectId != null 
                && projectIdMap.TryGetValue(exportedTask.ProjectId.Value, out var foundValue))
            {
                projectId = foundValue;
            }
            
            var item = new Item()
            {
                Description = exportedTask.Name,
                Done = exportedTask.Completed,
                Later = exportedTask.Later,
                UserId = userId,
                ProjectId = projectId
            };
            var itemId = _itemRepository.CreateItem(item);
            foreach (var exportedTagId in exportedTask.TagIds ?? [])
            {
                _itemTagMappingRepo.CreateMapping(new()
                {
                    ItemId = itemId,
                    TagId = tagIdMap[exportedTagId]
                });
            }
        }
    }

    private Dictionary<int, int> ImportTags(ExportedData data, int userId)
    {
        var idMap = new Dictionary<int, int>();
        foreach (var exportedTag in data.Tags ?? [])
        {
            var tag = new Tag()
            {
                Name = exportedTag.Name,
                UserId = userId
            };
            var tagId = _tagRepo.CreateTag(tag);
            idMap[exportedTag.Id] = tagId;
        }

        return idMap;
    }

    private Dictionary<int, int> ImportProjects(ExportedData data, int userId)
    {
        var idMap = new Dictionary<int, int>();
        foreach (var exportedProject in data.Projects ?? [])
        {
            var project = new Project()
            {
                Name = exportedProject.Name,
                Done = exportedProject.Completed,
                Later = exportedProject.Later,
                UserId = userId
            };
            var projectId = _projectRepo.CreateProject(project);
            idMap[exportedProject.Id] = projectId;
        }

        return idMap;
    }
}