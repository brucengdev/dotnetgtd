using Backend.Core.Manager;
using Backend.Models;

namespace Backend.WebApi;

public static class SeedData {
    public static void Initialize(GTDContext context)
    {
        if (context.Users != null && context.Users.Any())
        {
            return;
        }

        context.Users.Add(new User
        {
            Id = 0,
            Username = "admin",
            PasswordHash = AccountManager.CreateHash("admin")
        });

        context.SaveChanges();
    }
}