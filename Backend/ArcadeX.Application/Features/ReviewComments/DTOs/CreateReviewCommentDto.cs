namespace ArcadeX.Application.Features.ReviewComments.DTOs;

public class CreateReviewCommentDto
{
    public Guid ReviewId { get; set; }
    public string Comment { get; set; } = string.Empty;
    
}