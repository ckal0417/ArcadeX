using ArcadeX.Application.Features.Achievements.DTOs;

namespace ArcadeX.Application.Features.Achievements.Interfaces;

public interface IAchievementService
{
    
    Task<List<AchievementResponseDto>> GetByGameAsync(Guid gameId);
    Task<AchievementResponseDto> CreateAsync(CreateAchievementDto dto);
    Task<UserAchievementResponseDto> UnlockAsync(Guid userId, Guid achievementId);
    Task<List<UserAchievementResponseDto>> GetMineAsync(Guid userId);

}