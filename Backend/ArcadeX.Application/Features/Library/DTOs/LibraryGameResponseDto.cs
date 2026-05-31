namespace ArcadeX.Application.Features.Library.DTOs;

public class LibraryGameResponseDto
{

    public Guid GameId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public DateTime PurchaseDate { get; set; }
    public int PlayTimeMinutes { get; set; }
    public List<string> Genres { get; set; } = new();
    
}