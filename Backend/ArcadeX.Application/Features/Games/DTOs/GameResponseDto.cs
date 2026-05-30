namespace ArcadeX.Application.Features.Games.DTOs;

public class GameResponseDto
{
    
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public DateTime ReleaseDate { get; set; }
    public Guid OwnerId { get; set; }
    public string OwnerUsername { get; set; } = string.Empty;
    public List<string> Genres { get; set; } = new();

}