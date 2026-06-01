using ArcadeX.Application.Features.Achievements.DTOs;
using ArcadeX.Application.Features.Achievements.Interfaces;
using ArcadeX.Persistence.Context;
using ArcadeX.Persistence.Entities;
using Microsoft.EntityFrameworkCore;

namespace ArcadeX.Persistence.Features.Achievements.Repositories;

public class AchievementRepository : IAchievementRepository
{
    private readonly ArcadeXDbContext _context;

    public AchievementRepository(ArcadeXDbContext context)
    {
        _context = context;
    }

    public async Task<List<AchievementResponseDto>> GetByGameAsync(Guid gameId)
    {
        return await _context.Achievements
            .Where(achievement => achievement.GameId == gameId)
            .Include(achievement => achievement.Game)
            .Select(achievement => new AchievementResponseDto
            {
                Id = achievement.Id,
                GameId = achievement.GameId,
                GameTitle = achievement.Game.Title,
                Title = achievement.Title,
                Description = achievement.Description
            })
            .ToListAsync();
    }

    public async Task<AchievementResponseDto?> CreateAsync(CreateAchievementDto dto)
    {
        var achievement = new Achievement
        {
            Id = Guid.NewGuid(),
            GameId = dto.GameId,
            Title = dto.Title,
            Description = dto.Description
        };

        _context.Achievements.Add(achievement);

        await _context.SaveChangesAsync();

        return await _context.Achievements
            .Where(item => item.Id == achievement.Id)
            .Include(item => item.Game)
            .Select(item => new AchievementResponseDto
            {
                Id = item.Id,
                GameId = item.GameId,
                GameTitle = item.Game.Title,
                Title = item.Title,
                Description = item.Description
            })
            .FirstOrDefaultAsync();
    }

    public async Task<UserAchievementResponseDto?> UnlockAsync(Guid userId, Guid achievementId)
    {
        var userAchievement = new UserAchievement
        {
            UserId = userId,
            AchievementId = achievementId,
            UnlockedAt = DateTime.UtcNow
        };

        _context.UserAchievements.Add(userAchievement);

        await _context.SaveChangesAsync();

        return await _context.UserAchievements
            .Where(item =>
                item.UserId == userId &&
                item.AchievementId == achievementId
            )
            .Include(item => item.Achievement)
            .ThenInclude(achievement => achievement.Game)
            .Select(item => new UserAchievementResponseDto
            {
                AchievementId = item.AchievementId,
                Title = item.Achievement.Title,
                Description = item.Achievement.Description,
                GameId = item.Achievement.GameId,
                GameTitle = item.Achievement.Game.Title,
                UnlockedAt = item.UnlockedAt
            })
            .FirstOrDefaultAsync();
    }

    public async Task<List<UserAchievementResponseDto>> GetMineAsync(Guid userId)
    {
        return await _context.UserAchievements
            .Where(item => item.UserId == userId)
            .Include(item => item.Achievement)
            .ThenInclude(achievement => achievement.Game)
            .Select(item => new UserAchievementResponseDto
            {
                AchievementId = item.AchievementId,
                Title = item.Achievement.Title,
                Description = item.Achievement.Description,
                GameId = item.Achievement.GameId,
                GameTitle = item.Achievement.Game.Title,
                UnlockedAt = item.UnlockedAt
            })
            .ToListAsync();
    }

    public async Task<bool> GameExistsAsync(Guid gameId)
    {
        return await _context.Games.AnyAsync(game => game.Id == gameId);
    }

    public async Task<bool> AchievementExistsAsync(Guid achievementId)
    {
        return await _context.Achievements.AnyAsync(achievement => achievement.Id == achievementId);
    }

    public async Task<bool> UserAlreadyUnlockedAsync(Guid userId, Guid achievementId)
    {
        return await _context.UserAchievements
            .AnyAsync(item =>
                item.UserId == userId &&
                item.AchievementId == achievementId
            );
    }
}