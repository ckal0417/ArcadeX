namespace ArcadeX.Persistence.Entities;

public class UserGame
{
    public Guid UserId { get; set; }
    public Guid GameId { get; set; }
    public DateTime PurchaseDate { get; set; }
    public int PlayTimeMinutes { get; set; }
    public User User { get; set; } = null!;
    public Game Game { get; set; } = null!;
    
}