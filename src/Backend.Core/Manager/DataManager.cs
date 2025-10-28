using Backend.Core.Repository;
using Backend.Models;

namespace Backend.Core.Manager;

public class DataManager:IDataManager
{
    private readonly IItemRepository _itemRepository;
    public DataManager(IItemRepository itemRepo)
    {
        _itemRepository = itemRepo;
    }
    public void Import(UserData data, int userId)
    {
        _itemRepository.Clear(userId);
    }
}