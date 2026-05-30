using System.Security.Claims;
using ArcadeX.Application.Features.Library.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ArcadeX.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class LibraryController : ControllerBase
{
    private readonly ILibraryService _libraryService;

    public LibraryController(ILibraryService libraryService)
    {
        _libraryService = libraryService;
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetMyLibrary()
    {
        var userId = Guid.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!
        );

        var library = await _libraryService.GetMyLibraryAsync(userId);

        return Ok(library);
    }

    [HttpPost("{gameId:guid}")]
    public async Task<IActionResult> AddGame(Guid gameId)
    {
        var userId = Guid.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!
        );

        var game = await _libraryService.AddGameAsync(userId, gameId);

        return Ok(game);
    }
}