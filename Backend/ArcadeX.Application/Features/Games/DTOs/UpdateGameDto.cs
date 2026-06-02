namespace ArcadeX.Application.Features.Games.DTOs;

public class UpdateGameDto
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public DateTime ReleaseDate { get; set; }
    public List<string> Genres { get; set; } = new();
    public string? CoverImageUrl { get; set; }
    
}