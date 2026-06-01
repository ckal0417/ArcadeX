namespace ArcadeX.Application.Features.Reviews.DTOs;

public class CreateReviewDto
{
    
    public Guid GameId { get; set; }
    public int Rating { get; set; }
    public string? Comment { get; set; }

}