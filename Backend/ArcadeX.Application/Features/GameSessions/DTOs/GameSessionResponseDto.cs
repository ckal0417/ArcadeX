namespace ArcadeX.Application.Features.GameSessions.DTOs;

public class GameSessionResponseDto
{
    
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public Guid GameId { get; set; }
    public string GameTitle { get; set; } = string.Empty;
    public DateTime? StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    public int? DurationMinutes { get; set; }

}