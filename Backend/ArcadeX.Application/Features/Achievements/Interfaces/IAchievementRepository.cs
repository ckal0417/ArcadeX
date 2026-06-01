using ArcadeX.Application.Features.Achievements.DTOs;

namespace ArcadeX.Application.Features.Achievements.Interfaces;

public interface IAchievementRepository
{
    
    Task<List<AchievementResponseDto>> GetByGameAsync(Guid gameId);
    Task<AchievementResponseDto?> CreateAsync(CreateAchievementDto dto);
    Task<UserAchievementResponseDto?> UnlockAsync(Guid userId, Guid achievementId);
    Task<List<UserAchievementResponseDto>> GetMineAsync(Guid userId);
    Task<bool> GameExistsAsync(Guid gameId);
    Task<bool> AchievementExistsAsync(Guid achievementId);
    Task<bool> UserAlreadyUnlockedAsync(Guid userId, Guid achievementId);

}