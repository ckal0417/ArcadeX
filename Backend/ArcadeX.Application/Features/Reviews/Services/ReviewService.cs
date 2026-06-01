using ArcadeX.Application.Common.Exceptions;
using ArcadeX.Application.Features.Reviews.DTOs;
using ArcadeX.Application.Features.Reviews.Interfaces;

namespace ArcadeX.Application.Features.Reviews.Services;

public class ReviewService : IReviewService
{
    private readonly IReviewRepository _reviewRepository;

    public ReviewService(IReviewRepository reviewRepository)
    {
        _reviewRepository = reviewRepository;
    }

    public async Task<List<ReviewResponseDto>> GetAllAsync()
    {
        return await _reviewRepository.GetAllAsync();
    }

    public async Task<List<ReviewResponseDto>> GetByGameAsync(Guid gameId)
    {
        return await _reviewRepository.GetByGameAsync(gameId);
    }

    public async Task<ReviewResponseDto?> GetByIdAsync(Guid id)
    {
        return await _reviewRepository.GetByIdAsync(id);
    }

    public async Task<ReviewResponseDto> CreateAsync(Guid userId, CreateReviewDto dto)
    {
        if (dto.Rating < 1 || dto.Rating > 5)
        {
            throw new BadRequestException("Rating must be between 1 and 5");
        }

        var ownsGame = await _reviewRepository.UserOwnsGameAsync(userId, dto.GameId);

        if (!ownsGame)
        {
            throw new BadRequestException("User must own the game before reviewing it");
        }

        var alreadyReviewed = await _reviewRepository.UserAlreadyReviewedGameAsync(userId, dto.GameId);

        if (alreadyReviewed)
        {
            throw new BadRequestException("User already reviewed this game");
        }

        var review = await _reviewRepository.CreateAsync(userId, dto);

        if (review is null)
        {
            throw new BadRequestException("Could not create review");
        }

        return review;
    }

    public async Task<ReviewResponseDto?> UpdateAsync(Guid userId, Guid reviewId, UpdateReviewDto dto)
    {
        if (dto.Rating < 1 || dto.Rating > 5)
        {
            throw new BadRequestException("Rating must be between 1 and 5");
        }

        return await _reviewRepository.UpdateAsync(userId, reviewId, dto);
    }

    public async Task<bool> DeleteAsync(Guid userId, Guid reviewId, bool isAdmin)
    {
        return await _reviewRepository.DeleteAsync(userId, reviewId, isAdmin);
    }
}