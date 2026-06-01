namespace ArcadeX.Persistence.Entities;

public class Review
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid GameId { get; set; }
    public int Rating { get; set; }
    public string? Comment { get; set; }
    public DateTime CreatedAt { get; set; }
    public User User { get; set; } = null!;
    public Game Game { get; set; } = null!;
    public ICollection<ReviewComment> ReviewComments { get; set; } = new List<ReviewComment>();

}