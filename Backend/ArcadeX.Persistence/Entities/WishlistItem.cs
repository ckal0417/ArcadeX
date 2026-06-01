namespace ArcadeX.Persistence.Entities;

public class WishlistItem
{
    public Guid UserId { get; set; }
    public Guid GameId { get; set; }
    public DateTime AddedAt { get; set; }
    public User User { get; set; } = null!;
    public Game Game { get; set; } = null!;
    
}