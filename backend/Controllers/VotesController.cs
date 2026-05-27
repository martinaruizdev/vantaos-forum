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
public class VotesController : ControllerBase
{
    private readonly AppDbContext _context;

    public VotesController(AppDbContext context)
    {
        _context = context;
    }

    // POST api/votes
    // Lógica toggle:
    //   - Sin voto previo      → crea voto, ajusta score en +value
    //   - Mismo valor que antes → elimina voto (toggle off), revierte score
    //   - Valor distinto       → cambia voto, ajusta score en (newValue - oldValue)
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Vote([FromBody] VoteDto dto)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userIdClaim == null) return Unauthorized();
        var userId = int.Parse(userIdClaim);

        // Validaciones básicas
        if (dto.Value != 1 && dto.Value != -1)
            return BadRequest("Value must be +1 or -1.");

        if (dto.TargetType != "post" && dto.TargetType != "comment")
            return BadRequest("TargetType must be 'post' or 'comment'.");

        // Buscar voto previo del mismo usuario sobre el mismo target
        var existing = await _context.Votes
            .FirstOrDefaultAsync(v =>
                v.UserId == userId &&
                v.TargetId == dto.TargetId &&
                v.TargetType == dto.TargetType);

        int scoreDelta;
        int? newUserVote;

        if (existing != null)
        {
            if (existing.Value == dto.Value)
            {
                // Toggle off: quitar el voto
                scoreDelta = -dto.Value;
                newUserVote = null;
                _context.Votes.Remove(existing);
            }
            else
            {
                // Cambiar de upvote a downvote o viceversa
                scoreDelta = dto.Value - existing.Value; // p.ej. +1 - (-1) = +2
                newUserVote = dto.Value;
                existing.Value = dto.Value;
            }
        }
        else
        {
            // Voto nuevo
            scoreDelta = dto.Value;
            newUserVote = dto.Value;
            _context.Votes.Add(new Vote
            {
                UserId = userId,
                TargetId = dto.TargetId,
                TargetType = dto.TargetType,
                Value = dto.Value,
            });
        }

        // Actualizar score en el target correspondiente
        int newScore;

        if (dto.TargetType == "post")
        {
            var post = await _context.Posts.FindAsync(dto.TargetId);
            if (post == null) return NotFound("Post not found.");
            post.Score += scoreDelta;
            newScore = post.Score;
        }
        else
        {
            var comment = await _context.Comments.FindAsync(dto.TargetId);
            if (comment == null) return NotFound("Comment not found.");
            comment.Score += scoreDelta;
            newScore = comment.Score;
        }

        await _context.SaveChangesAsync();

        return Ok(new VoteResponseDto
        {
            NewScore = newScore,
            UserVote = newUserVote,
        });
    }
}
