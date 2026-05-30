using System.Security.Claims;
using ArcadeX.Application.Features.Games.DTOs;
using ArcadeX.Application.Features.Games.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ArcadeX.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GamesController : ControllerBase
{
    private readonly IGameService _gameService;

    public GamesController(IGameService gameService)
    {
        _gameService = gameService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var games = await _gameService.GetAllAsync();

        return Ok(games);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var game = await _gameService.GetByIdAsync(id);

        if (game is null)
        {
            return NotFound(new
            {
                message = "Game not found"
            });
        }

        return Ok(game);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Developer,Publisher")]
    public async Task<IActionResult> Create(CreateGameDto dto)
    {
        var ownerId = Guid.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!
        );

        var game = await _gameService.CreateAsync(dto, ownerId);

        return CreatedAtAction(
            nameof(GetById),
            new { id = game.Id },
            game
        );
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin,Developer,Publisher")]
    public async Task<IActionResult> Update(Guid id, UpdateGameDto dto)
    {
        var game = await _gameService.UpdateAsync(id, dto);

        if (game is null)
        {
            return NotFound(new
            {
                message = "Game not found"
            });
        }

        return Ok(game);
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin,Developer,Publisher")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _gameService.DeleteAsync(id);

        if (!deleted)
        {
            return NotFound(new
            {
                message = "Game not found"
            });
        }

        return NoContent();
    }
}