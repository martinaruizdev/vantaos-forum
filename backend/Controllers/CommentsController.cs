using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using VantaOS.API.Data;
using VantaOS.API.DTOs;
using VantaOS.API.Models;

namespace VantaOS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CommentsController : ControllerBase
{
    private readonly AppDbContext _context;

    public CommentsController(AppDbContext context)
    {
        _context = context;
    }

    // GET api/comments?postId=1
    [HttpGet]
    public async Task<IActionResult> GetByPost([FromQuery] int postId)
    {
        var comments = await _context.Comments
            .Include(c => c.User)
            .Include(c => c.Replies).ThenInclude(r => r.User)
            .Where(c => c.PostId == postId && c.ParentId == null)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();

        return Ok(comments);
    }

    // POST api/comments  ← requiere JWT
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] CreateCommentDto dto)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userIdClaim == null) return Unauthorized();

        var userId = int.Parse(userIdClaim);

        var postExists = await _context.Posts.AnyAsync(p => p.Id == dto.PostId);
        if (!postExists) return BadRequest("Post not found.");

        var comment = new Comment
        {
            Content = dto.Content,
            PostId = dto.PostId,
            UserId = userId,
            ParentId = dto.ParentId,
            CreatedAt = DateTime.UtcNow,
        };

        _context.Comments.Add(comment);
        await _context.SaveChangesAsync();

        var result = await _context.Comments
            .Include(c => c.User)
            .FirstAsync(c => c.Id == comment.Id);

        return CreatedAtAction(nameof(GetByPost), new { postId = comment.PostId }, result);
    }

    // PUT api/comments/5  ← solo el autor o admin
    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateCommentDto dto)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userIdClaim == null) return Unauthorized();

        var userId = int.Parse(userIdClaim);
        var role = User.FindFirstValue(ClaimTypes.Role);

        var comment = await _context.Comments.FindAsync(id);
        if (comment == null) return NotFound();

        if (comment.UserId != userId && role != "admin")
            return Forbid();

        comment.Content = dto.Content;
        await _context.SaveChangesAsync();
        return Ok(comment);
    }

    // DELETE api/comments/5  ← solo el autor o admin
    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userIdClaim == null) return Unauthorized();

        var userId = int.Parse(userIdClaim);
        var role = User.FindFirstValue(ClaimTypes.Role);

        var comment = await _context.Comments.FindAsync(id);
        if (comment == null) return NotFound();

        if (comment.UserId != userId && role != "admin")
            return Forbid();

        _context.Comments.Remove(comment);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
