using ArcadeX.Application.Features.Reviews.DTOs;

namespace ArcadeX.Application.Features.Reviews.Interfaces;

public interface IReviewRepository
{
    Task<List<ReviewResponseDto>> GetAllAsync();
    Task<List<ReviewResponseDto>> GetByGameAsync(Guid gameId);
    Task<ReviewResponseDto?> GetByIdAsync(Guid id);
    Task<ReviewResponseDto?> CreateAsync(Guid userId, CreateReviewDto dto);
    Task<ReviewResponseDto?> UpdateAsync(Guid userId, Guid reviewId, UpdateReviewDto dto);
    Task<bool> DeleteAsync(Guid userId, Guid reviewId, bool isAdmin);
    Task<bool> UserOwnsGameAsync(Guid userId, Guid gameId);
    Task<bool> UserAlreadyReviewedGameAsync(Guid userId, Guid gameId);
    
}