namespace ArcadeX.Application.Features.Achievements.DTOs;

public class UserAchievementResponseDto
{
    
    public Guid AchievementId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public Guid GameId { get; set; }
    public string GameTitle { get; set; } = string.Empty;
    public DateTime UnlockedAt { get; set; }

}