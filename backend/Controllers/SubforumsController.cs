using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VantaOS.API.Data;
using VantaOS.API.Models;

namespace VantaOS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SubforumsController : ControllerBase{
    private readonly AppDbContext _context;

    public SubforumsController(AppDbContext context){
        _context = context;
    }

    //GET api/subforums
    [HttpGet]
    public async Task<IActionResult> GetAll(){
        var subforums = await _context.Subforums.ToListAsync();
        return Ok(subforums);
    }

    //GET api/subforums/kernel
    [HttpGet("{slug}")]
    public async Task<IActionResult> GetBySlug(string slug){
        var subforum = await _context.Subforums
        .FirstOrDefaultAsync(s => s.Slug == slug);

        if (subforum == null) return NotFound();
        return Ok(subforum);
    }

    //POST api/subforums
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Subforum subforum){
        _context.Subforums.Add(subforum);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetBySlug), new { slug = subforum.Slug }, subforum);
    }
}