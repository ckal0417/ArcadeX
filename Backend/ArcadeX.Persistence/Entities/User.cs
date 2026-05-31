namespace ArcadeX.Persistence.Entities;

public class User


{
    public Guid Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string? Country { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime LastLogin { get; set; }
    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
    public ICollection<Game> Games { get; set; } = new List<Game>();
    public ICollection<UserGame> UserGames { get; set; } = new List<UserGame>();

}