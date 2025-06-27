using Microsoft.EntityFrameworkCore;

namespace Backend.Models
{
    public class GTDContext: DbContext
    {
        public DbSet<Entry> Entries { get;set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Category> Categories { get; set; }

        public GTDContext(DbContextOptions<GTDContext> options)
            : base(options)
        {
        }

    }
}
