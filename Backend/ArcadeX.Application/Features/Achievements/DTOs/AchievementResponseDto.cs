namespace ArcadeX.Application.Features.Achievements.DTOs;

public class AchievementResponseDto
{
    public Guid Id { get; set; }
    public Guid GameId { get; set; }
    public string GameTitle { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    
}