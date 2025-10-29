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
        _itemRepository.Clear(userId);
        _projectRepo.Clear(userId);
        _tagRepo.Clear(userId);
    }
}