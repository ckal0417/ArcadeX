using System.Security.Claims;
using ArcadeX.Application.Features.Wishlist.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ArcadeX.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class WishlistController : ControllerBase
{
    private readonly IWishlistService _wishlistService;

    public WishlistController(IWishlistService wishlistService)
    {
        _wishlistService = wishlistService;
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetMyWishlist()
    {
        var userId = Guid.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!
        );

        var wishlist = await _wishlistService.GetMyWishlistAsync(userId);

        return Ok(wishlist);
    }

    [HttpPost("{gameId:guid}")]
    public async Task<IActionResult> AddGame(Guid gameId)
    {
        var userId = Guid.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!
        );

        var game = await _wishlistService.AddGameAsync(userId, gameId);

        return Ok(game);
    }

    [HttpDelete("{gameId:guid}")]
    public async Task<IActionResult> RemoveGame(Guid gameId)
    {
        var userId = Guid.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!
        );

        var removed = await _wishlistService.RemoveGameAsync(userId, gameId);

        if (!removed)
        {
            return NotFound(new
            {
                message = "Game not found in wishlist"
            });
        }

        return NoContent();
    }
}