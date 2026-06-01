using ArcadeX.Application.Features.ReviewComments.DTOs;
using ArcadeX.Application.Features.ReviewComments.Interfaces;
using ArcadeX.Persistence.Context;
using ArcadeX.Persistence.Entities;
using Microsoft.EntityFrameworkCore;

namespace ArcadeX.Persistence.Features.ReviewComments.Repositories;

public class ReviewCommentRepository : IReviewCommentRepository
{
    private readonly ArcadeXDbContext _context;

    public ReviewCommentRepository(ArcadeXDbContext context)
    {
        _context = context;
    }

    public async Task<List<ReviewCommentResponseDto>> GetByReviewAsync(Guid reviewId)
    {
        return await _context.ReviewComments
            .Where(reviewComment => reviewComment.ReviewId == reviewId)
            .Include(reviewComment => reviewComment.User)
            .Select(reviewComment => new ReviewCommentResponseDto
            {
                Id = reviewComment.Id,
                ReviewId = reviewComment.ReviewId,
                UserId = reviewComment.UserId,
                Username = reviewComment.User.Username,
                Comment = reviewComment.Comment,
                CreatedAt = reviewComment.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<ReviewCommentResponseDto?> CreateAsync(
        Guid userId,
        CreateReviewCommentDto dto
    )
    {
        var reviewComment = new ReviewComment
        {
            ReviewId = dto.ReviewId,
            UserId = userId,
            Comment = dto.Comment,
            CreatedAt = DateTime.UtcNow
        };

        _context.ReviewComments.Add(reviewComment);

        await _context.SaveChangesAsync();

        return await _context.ReviewComments
            .Where(item => item.Id == reviewComment.Id)
            .Include(item => item.User)
            .Select(item => new ReviewCommentResponseDto
            {
                Id = item.Id,
                ReviewId = item.ReviewId,
                UserId = item.UserId,
                Username = item.User.Username,
                Comment = item.Comment,
                CreatedAt = item.CreatedAt
            })
            .FirstOrDefaultAsync();
    }

    public async Task<ReviewCommentResponseDto?> UpdateAsync(
        Guid userId,
        int commentId,
        UpdateReviewCommentDto dto
    )
    {
        var reviewComment = await _context.ReviewComments
            .FirstOrDefaultAsync(item =>
                item.Id == commentId &&
                item.UserId == userId
            );

        if (reviewComment is null)
        {
            return null;
        }

        reviewComment.Comment = dto.Comment;

        await _context.SaveChangesAsync();

        return await _context.ReviewComments
            .Where(item => item.Id == reviewComment.Id)
            .Include(item => item.User)
            .Select(item => new ReviewCommentResponseDto
            {
                Id = item.Id,
                ReviewId = item.ReviewId,
                UserId = item.UserId,
                Username = item.User.Username,
                Comment = item.Comment,
                CreatedAt = item.CreatedAt
            })
            .FirstOrDefaultAsync();
    }

    public async Task<bool> DeleteAsync(Guid userId, int commentId, bool isAdmin)
    {
        var reviewComment = await _context.ReviewComments
            .FirstOrDefaultAsync(item =>
                item.Id == commentId &&
                (
                    item.UserId == userId ||
                    isAdmin
                )
            );

        if (reviewComment is null)
        {
            return false;
        }

        _context.ReviewComments.Remove(reviewComment);

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> ReviewExistsAsync(Guid reviewId)
    {
        return await _context.Reviews
            .AnyAsync(review => review.Id == reviewId);
    }
}