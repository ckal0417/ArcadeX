namespace ArcadeX.Persistence.Entities;

public class Game
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public DateTime ReleaseDate { get; set; }
    public Guid OwnerId { get; set; }
    public User Owner { get; set; } = null!;
    public ICollection<GameGenre> GameGenres { get; set; } = new List<GameGenre>();
    public ICollection<UserGame> UserGames { get; set; } = new List<UserGame>();

}