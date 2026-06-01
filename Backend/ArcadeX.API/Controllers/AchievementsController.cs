using System.Security.Claims;
using ArcadeX.Application.Features.Achievements.DTOs;
using ArcadeX.Application.Features.Achievements.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ArcadeX.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AchievementsController : ControllerBase
{
    private readonly IAchievementService _achievementService;

    public AchievementsController(IAchievementService achievementService)
    {
        _achievementService = achievementService;
    }

    [HttpGet("game/{gameId:guid}")]
    public async Task<IActionResult> GetByGame(Guid gameId)
    {
        var achievements = await _achievementService.GetByGameAsync(gameId);
        return Ok(achievements);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Developer,Publisher")]
    public async Task<IActionResult> Create(CreateAchievementDto dto)
    {
        var achievement = await _achievementService.CreateAsync(dto);
        return Ok(achievement);
    }

    [HttpPost("{achievementId:guid}/unlock")]
    [Authorize]
    public async Task<IActionResult> Unlock(Guid achievementId)
    {
        var userId = Guid.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!
        );
        var achievement = await _achievementService.UnlockAsync(userId, achievementId);
        return Ok(achievement);
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> GetMine()
    {
        var userId = Guid.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!
        );
        var achievements = await _achievementService.GetMineAsync(userId);
        return Ok(achievements);
    }
}