namespace ArcadeX.Application.Features.Wishlist.DTOs;

public class WishlistGameResponseDto
{
    public Guid GameId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public DateTime AddedAt { get; set; }
    public List<string> Genres { get; set; } = new();
    
}