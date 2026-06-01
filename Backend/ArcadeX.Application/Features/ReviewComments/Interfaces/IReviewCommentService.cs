using ArcadeX.Application.Features.ReviewComments.DTOs;

namespace ArcadeX.Application.Features.ReviewComments.Interfaces;

public interface IReviewCommentService
{
    Task<List<ReviewCommentResponseDto>> GetByReviewAsync(Guid reviewId);
    Task<ReviewCommentResponseDto> CreateAsync(Guid userId, CreateReviewCommentDto dto);
    Task<ReviewCommentResponseDto?> UpdateAsync(
        Guid userId,
        int commentId,
        UpdateReviewCommentDto dto
    );
    Task<bool> DeleteAsync(Guid userId, int commentId, bool isAdmin);
    
}