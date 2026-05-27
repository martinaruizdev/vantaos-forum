using Microsoft.EntityFrameworkCore;
using VantaOS.API.Models;

namespace VantaOS.API.Data;

public class AppDbContext : DbContext{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    public DbSet<User> Users { get; set; }
    public DbSet<Subforum> Subforums { get; set; }
    public DbSet<Post> Posts { get; set; }
    public DbSet<Comment> Comments { get; set; }
    public DbSet<Tag> Tags { get; set; }
    public DbSet<Vote> Votes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder){
        //Tabla de relacion Posts<->Tags
        modelBuilder.Entity<Post>()
        .HasMany(p => p.Tags)
        .WithMany(t => t.Posts)
        .UsingEntity(j => j.ToTable("posts_tags"));

        //comentarios anidados
        modelBuilder.Entity<Comment>()
        .HasOne(c => c.Parent)
        .WithMany(c => c.Replies)
        .HasForeignKey(c => c.ParentId)
        .OnDelete(DeleteBehavior.Restrict);

        // Un usuario solo puede tener un voto por target
        modelBuilder.Entity<Vote>()
        .HasIndex(v => new { v.UserId, v.TargetId, v.TargetType })
        .IsUnique();
    }
}