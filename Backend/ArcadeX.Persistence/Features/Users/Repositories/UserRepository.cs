using ArcadeX.Application.Features.Users.DTOs;
using ArcadeX.Application.Features.Users.Interfaces;
using ArcadeX.Persistence.Context;
using Microsoft.EntityFrameworkCore;
using ArcadeX.Persistence.Entities;


namespace ArcadeX.Persistence.Features.Users.Repositories;

public class UserRepository : IUserRepository
{
    private readonly ArcadeXDbContext _context;

    public UserRepository(ArcadeXDbContext context)
    {
        _context = context;
    }

    public async Task<List<UserResponseDto>> GetAllAsync()
    {
        return await _context.Users
            .Include(u => u.UserRoles)
            .ThenInclude(ur => ur.Role)
            .Select(u => new UserResponseDto
            {
                Id = u.Id,
                Username = u.Username,
                Email = u.Email,
                Country = u.Country,
                CreatedAt = u.CreatedAt,
                LastLogin = u.LastLogin,
                Roles = u.UserRoles.Select(ur => ur.Role.Name).ToList()
            })
            .ToListAsync();
    }

    public async Task<UserResponseDto?> GetByIdAsync(Guid id)
    {
        return await _context.Users
            .Where(u => u.Id == id)
            .Include(u => u.UserRoles)
            .ThenInclude(ur => ur.Role)
            .Select(u => new UserResponseDto
            {
                Id = u.Id,
                Username = u.Username,
                Email = u.Email,
                Country = u.Country,
                CreatedAt = u.CreatedAt,
                LastLogin = u.LastLogin,
                Roles = u.UserRoles.Select(ur => ur.Role.Name).ToList()
            })
            .FirstOrDefaultAsync();
    }

    public async Task<UserResponseDto> CreateAsync(CreateUserDto dto)
    {
        var user = new User
        {
            Id = Guid.NewGuid(),
            Username = dto.Username,
            Email = dto.Email,
            PasswordHash = dto.Password,
            Country = dto.Country,
            CreatedAt = DateTime.UtcNow,
            LastLogin = DateTime.UtcNow
        };

        var requestedRoles = dto.Roles
            .Select(role => role.Trim())
            .Where(role => !string.IsNullOrWhiteSpace(role))
            .ToList();

        var roles = await _context.Roles
            .Where(role => requestedRoles.Contains(role.Name))
            .ToListAsync();

        _context.Users.Add(user);

        foreach (var role in roles)
        {
            _context.UserRoles.Add(new UserRole
            {
                UserId = user.Id,
                RoleId = role.Id
            });
        }

        await _context.SaveChangesAsync();

        return new UserResponseDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            Country = user.Country,
            CreatedAt = user.CreatedAt,
            LastLogin = user.LastLogin,
            Roles = roles.Select(role => role.Name).ToList()
        };
    }
}