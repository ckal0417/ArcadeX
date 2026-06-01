using ArcadeX.Application.Features.Reviews.DTOs;
using ArcadeX.Application.Features.Reviews.Interfaces;
using ArcadeX.Persistence.Context;
using ArcadeX.Persistence.Entities;
using Microsoft.EntityFrameworkCore;

namespace ArcadeX.Persistence.Features.Reviews.Repositories;

public class ReviewRepository : IReviewRepository
{
    private readonly ArcadeXDbContext _context;

    public ReviewRepository(ArcadeXDbContext context)
    {
        _context = context;
    }

    public async Task<List<ReviewResponseDto>> GetAllAsync()
    {
        return await _context.Reviews
            .Include(review => review.User)
            .Include(review => review.Game)
            .Select(review => new ReviewResponseDto
            {
                Id = review.Id,
                UserId = review.UserId,
                Username = review.User.Username,
                GameId = review.GameId,
                GameTitle = review.Game.Title,
                Rating = review.Rating,
                Comment = review.Comment,
                CreatedAt = review.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<List<ReviewResponseDto>> GetByGameAsync(Guid gameId)
    {
        return await _context.Reviews
            .Where(review => review.GameId == gameId)
            .Include(review => review.User)
            .Include(review => review.Game)
            .Select(review => new ReviewResponseDto
            {
                Id = review.Id,
                UserId = review.UserId,
                Username = review.User.Username,
                GameId = review.GameId,
                GameTitle = review.Game.Title,
                Rating = review.Rating,
                Comment = review.Comment,
                CreatedAt = review.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<ReviewResponseDto?> GetByIdAsync(Guid id)
    {
        return await _context.Reviews
            .Where(review => review.Id == id)
            .Include(review => review.User)
            .Include(review => review.Game)
            .Select(review => new ReviewResponseDto
            {
                Id = review.Id,
                UserId = review.UserId,
                Username = review.User.Username,
                GameId = review.GameId,
                GameTitle = review.Game.Title,
                Rating = review.Rating,
                Comment = review.Comment,
                CreatedAt = review.CreatedAt
            })
            .FirstOrDefaultAsync();
    }

    public async Task<ReviewResponseDto?> CreateAsync(Guid userId, CreateReviewDto dto)
    {
        var review = new Review
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            GameId = dto.GameId,
            Rating = dto.Rating,
            Comment = dto.Comment,
            CreatedAt = DateTime.UtcNow
        };

        _context.Reviews.Add(review);

        await _context.SaveChangesAsync();

        return await GetByIdAsync(review.Id);
    }

    public async Task<ReviewResponseDto?> UpdateAsync(Guid userId, Guid reviewId, UpdateReviewDto dto)
    {
        var review = await _context.Reviews
            .FirstOrDefaultAsync(review =>
                review.Id == reviewId &&
                review.UserId == userId
            );

        if (review is null)
        {
            return null;
        }

        review.Rating = dto.Rating;
        review.Comment = dto.Comment;

        await _context.SaveChangesAsync();

        return await GetByIdAsync(review.Id);
    }

    public async Task<bool> DeleteAsync(Guid userId, Guid reviewId, bool isAdmin)
    {
        var review = await _context.Reviews
            .FirstOrDefaultAsync(review =>
                review.Id == reviewId &&
                (
                    review.UserId == userId ||
                    isAdmin
                )
            );

        if (review is null)
        {
            return false;
        }

        _context.Reviews.Remove(review);

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> UserOwnsGameAsync(Guid userId, Guid gameId)
    {
        return await _context.UserGames
            .AnyAsync(userGame =>
                userGame.UserId == userId &&
                userGame.GameId == gameId
            );
    }

    public async Task<bool> UserAlreadyReviewedGameAsync(Guid userId, Guid gameId)
    {
        return await _context.Reviews
            .AnyAsync(review =>
                review.UserId == userId &&
                review.GameId == gameId
            );
    }
}