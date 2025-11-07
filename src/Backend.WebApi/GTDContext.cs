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
            modelBuilder.Entity<User>(e =>
            {
                e.HasIndex(u => u.Username)
                    .IsUnique();
            });
            modelBuilder.Entity<Item>(e =>
            {
                e.HasOne(i => i.User);
                e.HasOne(i => i.Project);
                e.HasMany(i => i.ItemTagMappings);
            });

            modelBuilder.Entity<Tag>(e =>
            {
                e.HasIndex(t => t.Name).IsUnique();
                e.HasOne(t => t.User);
                e.HasMany<ItemTagMapping>()
                    .WithOne(t => t.Tag)
                    .OnDelete(DeleteBehavior.NoAction);
            });

            modelBuilder.Entity<Project>(e =>
            {
                e.HasIndex(p => p.Name).IsUnique();
                e.HasOne(p => p.User);
            });
        }
    }
}
