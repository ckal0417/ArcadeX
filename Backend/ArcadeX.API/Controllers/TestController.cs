using ArcadeX.Persistence.Context;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ArcadeX.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TestController : ControllerBase
{
    private readonly ArcadeXDbContext _context;

    public TestController(ArcadeXDbContext context)
    {
        _context = context;
    }

    [HttpGet] public async Task<IActionResult> Get()
    {
        var users = await _context.Users.Include(u => u.UserRoles).ThenInclude(ur => ur.Role).ToListAsync();
        return Ok(users);
    }
}