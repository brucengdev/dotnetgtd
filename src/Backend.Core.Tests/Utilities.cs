using System.Security.Cryptography;
using System.Text;

namespace Backend.Core.Tests;

internal class Utilities
{
    
    internal static string CreateHash(string input)
    {
        using var algo = SHA256.Create();
        var hash = algo.ComputeHash(Encoding.UTF8.GetBytes(input));
        return Convert.ToBase64String(hash);
    }
}