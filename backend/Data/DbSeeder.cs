using Microsoft.EntityFrameworkCore;
using VantaOS.API.Models;

namespace VantaOS.API.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        // Solo seedea si no hay datos
        if (await context.Users.AnyAsync()) return;

        // Usuarios
        var users = new List<User>
        {
            new User { Username = "martina", Email = "martina@vantaos.com", PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"), Role = "admin", CreatedAt = DateTime.UtcNow },
            new User { Username = "ghami_mi_amor", Email = "ghami@vantaos.com", PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"), Role = "member", CreatedAt = DateTime.UtcNow },
            new User { Username = "cochino_yuen", Email = "cochino@vantaos.com", PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"), Role = "member", CreatedAt = DateTime.UtcNow },
            new User { Username = "locro_vergano", Email = "locro@vantaos.com", PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"), Role = "member", CreatedAt = DateTime.UtcNow },
        };

        context.Users.AddRange(users);
        await context.SaveChangesAsync();

        // Subforos
        var subforums = new List<Subforum>
        {
            new Subforum { Name = "Kernel Development", Slug = "kernel", Description = "Discussions about process scheduling, memory management and file system architecture.", CreatedAt = DateTime.UtcNow },
            new Subforum { Name = "User Interface", Slug = "ui", Description = "Designing the visual language and interaction patterns of VantaOS.", CreatedAt = DateTime.UtcNow },
            new Subforum { Name = "Drivers", Slug = "drivers", Description = "Hardware abstraction layers and device driver implementation.", CreatedAt = DateTime.UtcNow },
            new Subforum { Name = "General Discussion", Slug = "general", Description = "Community lounge for non-technical banter and ecosystem updates.", CreatedAt = DateTime.UtcNow },
        };

        context.Subforums.AddRange(subforums);
        await context.SaveChangesAsync();

        // Posts
        var posts = new List<Post>
        {
            new Post { Title = "How to write a basic kernel module?", Content = "I want to learn how to write my first kernel module for VantaOS. Where should I start?", UserId = users[1].Id, SubforumId = subforums[0].Id, Score = 42, CreatedAt = DateTime.UtcNow.AddHours(-5) },
            new Post { Title = "Understanding memory management in Linux", Content = "Memory management is one of the most critical aspects of OS development. Let's discuss virtual memory, paging, and the buddy allocator system.", UserId = users[2].Id, SubforumId = subforums[0].Id, Score = 87, CreatedAt = DateTime.UtcNow.AddHours(-10) },
            new Post { Title = "Race condition in interrupt handler", Content = "I'm experiencing a race condition when handling hardware interrupts concurrently. Here's what I've tried so far.", UserId = users[1].Id, SubforumId = subforums[0].Id, Score = 34, CreatedAt = DateTime.UtcNow.AddDays(-1) },
            new Post { Title = "Proposal for new UI design system", Content = "I've been working on a cohesive design system for VantaOS. Sharing my progress and looking for feedback.", UserId = users[3].Id, SubforumId = subforums[1].Id, Score = 56, CreatedAt = DateTime.UtcNow.AddHours(-3) },
            new Post { Title = "Writing a USB driver from scratch", Content = "Step by step guide on implementing a USB HID driver for VantaOS. This covers enumeration, descriptors and interrupt endpoints.", UserId = users[2].Id, SubforumId = subforums[2].Id, Score = 71, CreatedAt = DateTime.UtcNow.AddDays(-2) },
            new Post { Title = "Welcome to VantaOS Forums!", Content = "This is the official community forum for VantaOS. Feel free to introduce yourself and share what you're working on.", UserId = users[0].Id, SubforumId = subforums[3].Id, Score = 120, IsPinned = true, CreatedAt = DateTime.UtcNow.AddDays(-7) },
        };

        context.Posts.AddRange(posts);
        await context.SaveChangesAsync();

        // Comentarios
        var comments = new List<Comment>
        {
            new Comment { Content = "Great question! Start with the official VantaOS kernel docs.", UserId = users[2].Id, PostId = posts[0].Id, Score = 15, CreatedAt = DateTime.UtcNow.AddHours(-4) },
            new Comment { Content = "I'd recommend reading about loadable kernel modules first.", UserId = users[3].Id, PostId = posts[0].Id, Score = 8, CreatedAt = DateTime.UtcNow.AddHours(-3) },
            new Comment { Content = "The buddy allocator is fascinating. Great writeup!", UserId = users[1].Id, PostId = posts[1].Id, Score = 22, CreatedAt = DateTime.UtcNow.AddHours(-8) },
            new Comment { Content = "Welcome everyone! Excited to be part of this community.", UserId = users[1].Id, PostId = posts[5].Id, Score = 45, CreatedAt = DateTime.UtcNow.AddDays(-6) },
            new Comment { Content = "Thanks for creating this space. Looking forward to contributing!", UserId = users[2].Id, PostId = posts[5].Id, Score = 31, CreatedAt = DateTime.UtcNow.AddDays(-6) },
        };

        context.Comments.AddRange(comments);
        await context.SaveChangesAsync();
    }
}