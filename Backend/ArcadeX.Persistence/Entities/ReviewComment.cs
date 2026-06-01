namespace ArcadeX.Persistence.Entities;

public class ReviewComment
{
    public int Id { get; set; }
    public Guid ReviewId { get; set; }
    public Guid UserId { get; set; }
    public string? Comment { get; set; }
    public DateTime CreatedAt { get; set; }
    public Review Review { get; set; } = null!;
    public User User { get; set; } = null!;
    
}