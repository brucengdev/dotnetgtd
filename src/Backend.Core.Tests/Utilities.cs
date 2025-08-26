using System.Security.Cryptography;
using System.Text;

namespace Backend.Core.Tests;

internal class Utilities
{
    
    private static string CreateHash(string input)
    {
        using var algo = SHA256.Create();
        var hash = algo.ComputeHash(Encoding.UTF8.GetBytes(input));
        return Convert.ToBase64String(hash);
    }

    public static string Token(string info, string password)
    {
        return $"{info}-{CreateHash(info + CreateHash(password))}";
    }
}