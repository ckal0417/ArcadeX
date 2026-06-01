using System.Security.Claims;
using ArcadeX.Application.Features.GameSessions.DTOs;
using ArcadeX.Application.Features.GameSessions.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ArcadeX.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class GameSessionsController : ControllerBase
{
    private readonly IGameSessionService _gameSessionService;

    public GameSessionsController(IGameSessionService gameSessionService)
    {
        _gameSessionService = gameSessionService;
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetMine()
    {
        var userId = Guid.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!
        );

        var sessions = await _gameSessionService.GetMineAsync(userId);

        return Ok(sessions);
    }

    [HttpPost("start")]
    public async Task<IActionResult> Start(StartGameSessionDto dto)
    {
        var userId = Guid.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!
        );

        var session = await _gameSessionService.StartAsync(userId, dto);

        return Ok(session);
    }

    [HttpPut("{sessionId:guid}/end")]
    public async Task<IActionResult> End(Guid sessionId)
    {
        var userId = Guid.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!
        );

        var session = await _gameSessionService.EndAsync(userId, sessionId);

        return Ok(session);
    }
}