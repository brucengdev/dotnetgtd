using Backend.Models;

namespace Backend.Core.Manager;

public interface IDataManager
{
    void Import(UserData data, int userId);
}