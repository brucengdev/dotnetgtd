using Microsoft.EntityFrameworkCore;

namespace Backend.Models
{
    public class GTDContext: DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Item> Items { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<Tag> Tags { get; set; }
        
        public DbSet<ItemTagMapping> ItemTagMappings { get; set; }

        public GTDContext(DbContextOptions<GTDContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Item>(e =>
            {
                e.HasOne(e => e.User);
                e.HasOne(e => e.Project);
                e.HasMany<ItemTagMapping>(e => e.ItemTagMappings);
            });

            modelBuilder.Entity<Tag>(e =>
            {
                e.HasOne(e => e.User);
                e.HasMany<ItemTagMapping>()
                    .WithOne(e => e.Tag)
                    .OnDelete(DeleteBehavior.NoAction);
            });
        }
    }
}
