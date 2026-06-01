namespace ArcadeX.Application.Features.ReviewComments.DTOs;

public class ReviewCommentResponseDto
{
    public int Id { get; set; }
    public Guid ReviewId { get; set; }
    public Guid UserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public string? Comment { get; set; }
    public DateTime CreatedAt { get; set; }
    
}