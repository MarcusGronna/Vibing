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
            b.ToTable("Boards");
            b.HasMany(x => x.Tasks)
             .WithOne(t => t.Board)
             .HasForeignKey(t => t.BoardId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<TaskItem>(t =>
        {
            t.HasKey(x => x.Id);
            t.Property(x => x.Title).IsRequired().HasMaxLength(500);
            t.Property(x => x.Status).IsRequired().HasMaxLength(50).HasDefaultValue("Todo");
            t.Property(x => x.Priority).IsRequired().HasMaxLength(50).HasDefaultValue("Medium");
            t.Property(x => x.Description).HasMaxLength(2000);
            t.ToTable("Tasks");
        });

        base.OnModelCreating(modelBuilder);
    }
}
