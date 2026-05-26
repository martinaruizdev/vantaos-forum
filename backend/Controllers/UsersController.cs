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
}