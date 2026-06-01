namespace ArcadeX.Application.Features.Achievements.DTOs;

public class CreateAchievementDto
{
    
    public Guid GameId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }

}