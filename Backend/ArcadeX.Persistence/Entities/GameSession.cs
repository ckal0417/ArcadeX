namespace ArcadeX.Persistence.Entities;

public class GameSession
{
    
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid GameId { get; set; }
    public DateTime? StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    public User User { get; set; } = null!;
    public Game Game { get; set; } = null!;

}