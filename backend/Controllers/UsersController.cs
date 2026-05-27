using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using VantaOS.API.Data;
using VantaOS.API.Models;

namespace VantaOS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _context;

    public UsersController(AppDbContext context)
    {
        _context = context;
    }

    // POST api/users
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] User user)
    {
        user.CreatedAt = DateTime.UtcNow;
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return Ok(user);
    }

    // GET api/users
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var users = await _context.Users.ToListAsync();
        return Ok(users);
    }

    // GET api/users/{username}
    [HttpGet("{username}")]
    public async Task<IActionResult> GetByUsername(string username)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Username == username);

        if (user == null) return NotFound();

        var posts = await _context.Posts
            .Include(p => p.Subforum)
            .Include(p => p.Comments)
            .Where(p => p.UserId == user.Id)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();

        var comments = await _context.Comments
            .Include(c => c.Post).ThenInclude(p => p.Subforum)
            .Where(c => c.UserId == user.Id)
            .OrderByDescending(c => c.CreatedAt)
            .Take(10)
            .ToListAsync();

        var karma = posts.Sum(p => p.Score) + comments.Sum(c => c.Score);

        return Ok(new
        {
            user.Id,
            user.Username,
            user.Email,
            user.Role,
            user.CreatedAt,
            Karma = karma,
            PostCount = posts.Count,
            CommentCount = comments.Count,
            Posts = posts.Select(p => new
            {
                p.Id,
                p.Title,
                p.Score,
                p.CreatedAt,
                SubforumSlug = p.Subforum.Slug,
                CommentCount = p.Comments.Count,
            }),
            Comments = comments.Select(c => new
            {
                c.Id,
                c.Content,
                c.Score,
                c.CreatedAt,
                PostId = c.PostId,
                PostTitle = c.Post.Title,
                SubforumSlug = c.Post.Subforum.Slug,
            }),
        });
    }
}