using Microsoft.EntityFrameworkCore;

namespace Backend.Models
{
    public class GTDContext: DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Item> Items { get; set; }

        public GTDContext(DbContextOptions<GTDContext> options)
            : base(options)
        {
        }

    }
}
