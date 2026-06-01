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
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
    public ICollection<WishlistItem> WishlistItems { get; set; } = new List<WishlistItem>();
    public ICollection<UserAchievement> UserAchievements { get; set; } = new List<UserAchievement>();
    public ICollection<ReviewComment> ReviewComments { get; set; } = new List<ReviewComment>();
    public ICollection<Friend> FriendsSent { get; set; } = new List<Friend>();
    public ICollection<Friend> FriendsReceived { get; set; } = new List<Friend>();
    public ICollection<GameSession> GameSessions { get; set; } = new List<GameSession>();


}