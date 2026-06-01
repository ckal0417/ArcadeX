namespace ArcadeX.Persistence.Entities;

public class Achievement
{
    public Guid Id { get; set; }
    public Guid GameId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public Game Game { get; set; } = null!;
    public ICollection<UserAchievement> UserAchievements { get; set; } = new List<UserAchievement>();
    
}