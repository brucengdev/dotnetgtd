using System.Security.Cryptography;
using System.Text;
using Backend.Core.Repository;
using Backend.Models;

namespace Backend.Core.Manager;

public class UserNotFoundException : Exception
{
    
}

public class WrongPasswordException : Exception
{
    
}

public class MalformedTokenException : Exception
{
    
}

public class TokenExpiredException : Exception
{
    
}

public class AccountManager: IAccountManager
{
    internal IUserRepository _userRepository;

    public AccountManager(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }
    private bool VerifyUser(string username, string password)
    {
        var user = _userRepository.GetUser(username);
        if (user == null)
        {
            throw new UserNotFoundException();
        }

        if (user.Password != password)
        {
            throw new WrongPasswordException();
        }

        return true;
    }

    public CreateUserResult CreateUser(string username, string password)
    {
        if (_userRepository.UserExists(username))
        {
            return CreateUserResult.AlreadyExists;
        }
        _userRepository.AddUser(new User()
        {
            Username = username,
            Password = password
        });
        return CreateUserResult.Success;
    }

    public string CreateAccessToken(string username, string password, DateTime creationTime)
    {
        VerifyUser(username, password);
        var expiryTime = creationTime.AddHours(1);
        var info = $"{username}-{expiryTime.ToString("yyyy-MM-dd-HH-mm")}";
        var infoAndPassword = info + password;
        var hashedInfoAndPassword = CreateHash(infoAndPassword);
        return $"{info}-{hashedInfoAndPassword}";
    }
    
    private string CreateHash(string input)
    {
        using var algo = SHA256.Create();
        var hash = algo.ComputeHash(Encoding.UTF8.GetBytes(input));
        return Convert.ToBase64String(hash);
    }


    public bool IsTokenValid(string token, DateTime currentTime)
    {
        try
        {
            GetUserId(token, currentTime);
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    public int GetUserId(string accessToken, DateTime currentTime)
    {
        var username = "";
        DateTime expiry;
        try
        {
            var parts = accessToken.Split('-');
            username = parts[0];
            expiry = new DateTime(Convert.ToInt32(parts[1]),
                Convert.ToInt32(parts[2]),
                Convert.ToInt32(parts[3]),
                Convert.ToInt32(parts[4]),
                Convert.ToInt32(parts[5]),
                0);
        }
        catch (Exception)
        {
            throw new MalformedTokenException();
        }

        var user = _userRepository.GetUser(username);
        if (user == null)
        {
            throw new UserNotFoundException();
        }
        if (currentTime > expiry)
        {
            throw new TokenExpiredException();
        }
        return user.Id;
    }

    public User GetById(int userId)
    {
        return _userRepository.GetUser(userId);
    }
}