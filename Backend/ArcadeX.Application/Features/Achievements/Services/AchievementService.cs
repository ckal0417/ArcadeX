using ArcadeX.Application.Common.Exceptions;
using ArcadeX.Application.Features.Achievements.DTOs;
using ArcadeX.Application.Features.Achievements.Interfaces;

namespace ArcadeX.Application.Features.Achievements.Services;

public class AchievementService : IAchievementService
{
    private readonly IAchievementRepository _achievementRepository;

    public AchievementService(IAchievementRepository achievementRepository)
    {
        _achievementRepository = achievementRepository;
    }

    public async Task<List<AchievementResponseDto>> GetByGameAsync(Guid gameId)
    {
        return await _achievementRepository.GetByGameAsync(gameId);
    }

    public async Task<AchievementResponseDto> CreateAsync(CreateAchievementDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Title))
        {
            throw new BadRequestException("Achievement title is required");
        }

        var gameExists = await _achievementRepository.GameExistsAsync(dto.GameId);

        if (!gameExists)
        {
            throw new BadRequestException("Game does not exist");
        }

        var achievement = await _achievementRepository.CreateAsync(dto);

        if (achievement is null)
        {
            throw new BadRequestException("Could not create achievement");
        }

        return achievement;
    }

    public async Task<UserAchievementResponseDto> UnlockAsync(Guid userId, Guid achievementId)
    {
        var achievementExists = await _achievementRepository.AchievementExistsAsync(achievementId);

        if (!achievementExists)
        {
            throw new BadRequestException("Achievement does not exist");
        }

        var alreadyUnlocked = await _achievementRepository.UserAlreadyUnlockedAsync(userId, achievementId);

        if (alreadyUnlocked)
        {
            throw new BadRequestException("Achievement already unlocked");
        }

        var achievement = await _achievementRepository.UnlockAsync(userId, achievementId);

        if (achievement is null)
        {
            throw new BadRequestException("Could not unlock achievement");
        }

        return achievement;
    }

    public async Task<List<UserAchievementResponseDto>> GetMineAsync(Guid userId)
    {
        return await _achievementRepository.GetMineAsync(userId);
    }
}