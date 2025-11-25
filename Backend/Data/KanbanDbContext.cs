using Backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data;

public class KanbanDbContext : DbContext
{
    public KanbanDbContext(DbContextOptions<KanbanDbContext> options) : base(options) { }

    public DbSet<Board> Boards { get; set; } = null!;
    public DbSet<TaskItem> Tasks { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Board>(b =>
        {
            b.HasKey(x => x.Id);
            b.Property(x => x.Name).IsRequired().HasMaxLength(200);
            b.HasMany(x => x.Tasks)
             .WithOne(t => t.Board)
             .HasForeignKey(t => t.BoardId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<TaskItem>(t =>
        {
            t.HasKey(x => x.Id);
            t.Property(x => x.Title).IsRequired().HasMaxLength(500);
            t.Property(x => x.Status).IsRequired().HasDefaultValue("Todo").HasMaxLength(50);
        });

        base.OnModelCreating(modelBuilder);
    }
}
