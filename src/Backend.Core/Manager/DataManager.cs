using Backend.Core.Repository;
using Backend.Models;

namespace Backend.Core.Manager;

public class DataManager:IDataManager
{
    public DataManager(IItemRepository itemRepo)
    {
        
    }
    public void Import(UserData data, int userId)
    {
    }
}