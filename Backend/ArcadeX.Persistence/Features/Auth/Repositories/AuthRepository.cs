using ArcadeX.Application.Features.Auth.DTOs;
using ArcadeX.Application.Features.Auth.Interfaces;
using ArcadeX.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace ArcadeX.Persistence.Features.Auth.Repositories;

public class AuthRepository : IAuthRepository
{
    private readonly ArcadeXDbContext _context;
    private readonly IJwtService _jwtService;

    public AuthRepository(
        ArcadeXDbContext context,
        IJwtService jwtService
    )
    {
        _context = context;
        _jwtService = jwtService;
    }

    public async Task<AuthResponseDto?> LoginAsync(LoginDto dto)
    {
        var user = await _context.Users
            .Include(user => user.UserRoles)
            .ThenInclude(userRole => userRole.Role)
            .FirstOrDefaultAsync(user => user.Email == dto.Email);

        if (user is null || user.PasswordHash != dto.Password)
        {
            return null;
        }

        var roles = user.UserRoles
            .Select(userRole => userRole.Role.Name)
            .ToList();

        var token = _jwtService.GenerateToken(
            user.Id,
            user.Username,
            user.Email,
            roles
        );

        return new AuthResponseDto
        {
            Token = token,
            Username = user.Username,
            Email = user.Email,
            Roles = roles
        };
    }
}