using ArcadeX.Application.Features.Auth.DTOs;
using ArcadeX.Application.Features.Auth.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ArcadeX.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(
        IAuthService authService
    )
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(
        LoginDto dto
    )
    {
        var response = await _authService
            .LoginAsync(dto);

        return Ok(response);
    }
}