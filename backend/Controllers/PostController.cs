using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using VantaOS.API.Data;
using VantaOS.API.Models;
using VantaOS.API.DTOs;

namespace VantaOS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PostsController : ControllerBase{
    private readonly AppDbContext _context;

    public PostsController(AppDbContext context)
    {
        _context = context;
    }

    // GET api/posts?subforumSlug=kernel
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? subforumSlug)
    {
        var query = _context.Posts
        .Include(p => p.User)
        .Include(p => p.Subforum)
        .Include(p => p.Tags)
        .Include(p => p.Comments)
        .AsQueryable();

    if (!string.IsNullOrEmpty(subforumSlug))
        query = query.Where(p => p.Subforum.Slug == subforumSlug);

    var posts = await query
        .OrderByDescending(p => p.CreatedAt)
        .ToListAsync();

    return Ok(posts);
    }

    // GET api/posts/5
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var post = await _context.Posts
        .Include(p => p.User)
        .Include(p => p.Subforum)
        .Include(p => p.Tags)
        .Include(p => p.Comments)
        .ThenInclude(c => c.User)
        .FirstOrDefaultAsync(p => p.Id == id);

        if(post == null) return NotFound();
        return Ok(post);
    }

    // POST api/posts  ← requiere JWT
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] CreatePostDto dto)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userIdClaim == null) return Unauthorized();

        var userId = int.Parse(userIdClaim);

        var subforum = await _context.Subforums.FindAsync(dto.SubforumId);
        if(subforum == null) return BadRequest("Subforum not found");

        var post = new Post
        {
            Title = dto.Title,
            Content = dto.Content,
            UserId = userId,
            SubforumId = dto.SubforumId,
            CreatedAt = DateTime.UtcNow
        };

        _context.Posts.Add(post);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = post.Id }, post);
    }

    // DELETE api/posts/5  ← solo el autor o admin
    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userIdClaim == null) return Unauthorized();

        var userId = int.Parse(userIdClaim);
        var role = User.FindFirstValue(ClaimTypes.Role);

        var post = await _context.Posts.FindAsync(id);
        if(post == null) return NotFound();

        if (post.UserId != userId && role != "admin")
            return Forbid();

        _context.Posts.Remove(post);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
