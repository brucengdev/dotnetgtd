using Backend.Core.Repository;
using Backend.Models;

namespace Backend.Core.Manager;

public class DataManager:IDataManager
{
    private readonly IItemRepository _itemRepository;
    private readonly IProjectRepository _projectRepo;
    public DataManager(IItemRepository itemRepo, IProjectRepository projectRepo)
    {
        _itemRepository = itemRepo;
        _projectRepo = projectRepo;
    }
    public void Import(UserData data, int userId)
    {
        _itemRepository.Clear(userId);
        _projectRepo.Clear(userId);
    }
}