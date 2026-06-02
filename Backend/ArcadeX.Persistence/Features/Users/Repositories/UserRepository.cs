using ArcadeX.Application.Features.Users.DTOs;
using ArcadeX.Application.Features.Users.Interfaces;
using ArcadeX.Persistence.Context;
using ArcadeX.Persistence.Entities;
using Microsoft.EntityFrameworkCore;

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
            .Include(user => user.UserRoles)
            .ThenInclude(userRole => userRole.Role)
            .Select(user => new UserResponseDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Country = user.Country,
                AvatarUrl = user.AvatarUrl,
                CreatedAt = user.CreatedAt,
                LastLogin = user.LastLogin,
                Roles = user.UserRoles
                    .Select(userRole => userRole.Role.Name)
                    .ToList()
            })
            .ToListAsync();
    }

    public async Task<UserResponseDto?> GetByIdAsync(Guid id)
    {
        return await _context.Users
            .Where(user => user.Id == id)
            .Include(user => user.UserRoles)
            .ThenInclude(userRole => userRole.Role)
            .Select(user => new UserResponseDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Country = user.Country,
                AvatarUrl = user.AvatarUrl,
                CreatedAt = user.CreatedAt,
                LastLogin = user.LastLogin,
                Roles = user.UserRoles
                    .Select(userRole => userRole.Role.Name)
                    .ToList()
            })
            .FirstOrDefaultAsync();
    }

    public async Task<UserResponseDto> CreateAsync(
        CreateUserDto dto,
        List<string> requestedRoles
    )
    {
        var user = new User
        {
            Id = Guid.NewGuid(),
            Username = dto.Username,
            Email = dto.Email,
            PasswordHash = dto.Password,
            Country = dto.Country,
            AvatarUrl = dto.AvatarUrl,
            CreatedAt = DateTime.UtcNow,
            LastLogin = DateTime.UtcNow
        };

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

        return new UserResponseDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            Country = user.Country,
            AvatarUrl = user.AvatarUrl,
            CreatedAt = user.CreatedAt,
            LastLogin = user.LastLogin,
            Roles = roles.Select(role => role.Name).ToList()
        };
    }

    public async Task<UserResponseDto?> UpdateAsync(
        Guid id,
        UpdateUserDto dto,
        List<string> requestedRoles
    )
    {
        var user = await _context.Users
            .Include(user => user.UserRoles)
            .FirstOrDefaultAsync(user => user.Id == id);

        if (user is null)
        {
            return null;
        }

        var roles = await _context.Roles
            .Where(role => requestedRoles.Contains(role.Name))
            .ToListAsync();

        user.Username = dto.Username;
        user.Email = dto.Email;
        user.Country = dto.Country;
        user.AvatarUrl = dto.AvatarUrl;

        _context.UserRoles.RemoveRange(user.UserRoles);

        foreach (var role in roles)
        {
            user.UserRoles.Add(new UserRole
            {
                UserId = user.Id,
                RoleId = role.Id
            });
        }

        return new UserResponseDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            Country = user.Country,
            AvatarUrl = user.AvatarUrl,
            CreatedAt = user.CreatedAt,
            LastLogin = user.LastLogin,
            Roles = roles.Select(role => role.Name).ToList()
        };
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(user => user.Id == id);

        if (user is null)
        {
            return false;
        }

        var userRoles = _context.UserRoles.Where(item => item.UserId == id);
        var userGames = _context.UserGames.Where(item => item.UserId == id);
        var wishlist = _context.Wishlist.Where(item => item.UserId == id);
        var reviews = _context.Reviews.Where(item => item.UserId == id);
        var reviewComments = _context.ReviewComments.Where(item => item.UserId == id);
        var userAchievements = _context.UserAchievements.Where(item => item.UserId == id);
        var friends = _context.Friends.Where(item =>
            item.UserId == id ||
            item.FriendId == id
        );
        var gameSessions = _context.GameSessions.Where(item => item.UserId == id);

        _context.UserRoles.RemoveRange(userRoles);
        _context.UserGames.RemoveRange(userGames);
        _context.Wishlist.RemoveRange(wishlist);
        _context.Reviews.RemoveRange(reviews);
        _context.ReviewComments.RemoveRange(reviewComments);
        _context.UserAchievements.RemoveRange(userAchievements);
        _context.Friends.RemoveRange(friends);
        _context.GameSessions.RemoveRange(gameSessions);

        _context.Users.Remove(user);

        return true;
    }

    public async Task<bool> ExistsByUsernameOrEmailAsync(
        string username,
        string email
    )
    {
        return await _context.Users
            .AnyAsync(user =>
                user.Username == username ||
                user.Email == email
            );
    }

    public async Task<bool> ExistsByUsernameOrEmailForOtherUserAsync(
        Guid userId,
        string username,
        string email
    )
    {
        return await _context.Users
            .AnyAsync(user =>
                user.Id != userId &&
                (
                    user.Username == username ||
                    user.Email == email
                )
            );
    }

    public async Task<bool> RolesExistAsync(List<string> roles)
    {
        var normalizedRoles = roles
            .Select(role => role.Trim())
            .Where(role => !string.IsNullOrWhiteSpace(role))
            .Distinct()
            .ToList();

        var existingRolesCount = await _context.Roles
            .CountAsync(role => normalizedRoles.Contains(role.Name));

        return existingRolesCount == normalizedRoles.Count;
    }
}