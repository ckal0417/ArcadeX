using System.Security.Claims;
using ArcadeX.Application.Features.Friends.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ArcadeX.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class FriendsController : ControllerBase
{
    private readonly IFriendService _friendService;

    public FriendsController(IFriendService friendService)
    {
        _friendService = friendService;
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetMine()
    {
        var userId = Guid.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!
        );

        var friends = await _friendService.GetMineAsync(userId);

        return Ok(friends);
    }

    [HttpPost("{friendId:guid}")]
    public async Task<IActionResult> SendRequest(Guid friendId)
    {
        var userId = Guid.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!
        );

        var friend = await _friendService.SendRequestAsync(userId, friendId);

        return Ok(friend);
    }

    [HttpPut("{friendId:guid}/accept")]
    public async Task<IActionResult> AcceptRequest(Guid friendId)
    {
        var userId = Guid.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!
        );

        var friend = await _friendService.AcceptRequestAsync(userId, friendId);

        return Ok(friend);
    }

    [HttpDelete("{friendId:guid}")]
    public async Task<IActionResult> Delete(Guid friendId)
    {
        var userId = Guid.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!
        );

        var deleted = await _friendService.DeleteAsync(userId, friendId);

        if (!deleted)
        {
            return NotFound(new
            {
                message = "Friend relationship not found"
            });
        }

        return NoContent();
    }
}