using Backend.Core.Manager;
using Backend.Models;

namespace Backend.WebApi;

public static class SeedData {
    public static void Initialize(GTDContext context, string adminPassword, string salt)
    {
        if (context.Users != null && context.Users.Any())
        {
            return;
        }

        context.Users.Add(new User
        {
            Id = 0,
            Username = "admin",
            PasswordHash = AccountManager.CreateHash(adminPassword, salt)
        });

        context.SaveChanges();
    }
}