using ArcadeX.Application.Common.Exceptions;
using ArcadeX.Application.Features.ReviewComments.DTOs;
using ArcadeX.Application.Features.ReviewComments.Interfaces;

namespace ArcadeX.Application.Features.ReviewComments.Services;

public class ReviewCommentService : IReviewCommentService
{
    private readonly IReviewCommentRepository _reviewCommentRepository;

    public ReviewCommentService(IReviewCommentRepository reviewCommentRepository)
    {
        _reviewCommentRepository = reviewCommentRepository;
    }

    public async Task<List<ReviewCommentResponseDto>> GetByReviewAsync(Guid reviewId)
    {
        return await _reviewCommentRepository.GetByReviewAsync(reviewId);
    }

    public async Task<ReviewCommentResponseDto> CreateAsync(
        Guid userId,
        CreateReviewCommentDto dto
    )
    {
        if (string.IsNullOrWhiteSpace(dto.Comment))
        {
            throw new BadRequestException("Comment is required");
        }

        var reviewExists = await _reviewCommentRepository.ReviewExistsAsync(dto.ReviewId);

        if (!reviewExists)
        {
            throw new BadRequestException("Review does not exist");
        }

        var comment = await _reviewCommentRepository.CreateAsync(userId, dto);

        if (comment is null)
        {
            throw new BadRequestException("Could not create comment");
        }

        return comment;
    }

    public async Task<ReviewCommentResponseDto?> UpdateAsync(
        Guid userId,
        int commentId,
        UpdateReviewCommentDto dto
    )
    {
        if (string.IsNullOrWhiteSpace(dto.Comment))
        {
            throw new BadRequestException("Comment is required");
        }

        return await _reviewCommentRepository.UpdateAsync(userId, commentId, dto);
    }

    public async Task<bool> DeleteAsync(Guid userId, int commentId, bool isAdmin)
    {
        return await _reviewCommentRepository.DeleteAsync(userId, commentId, isAdmin);
    }
}