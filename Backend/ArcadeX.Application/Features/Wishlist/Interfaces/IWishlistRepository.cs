using ArcadeX.Application.Features.Wishlist.DTOs;

namespace ArcadeX.Application.Features.Wishlist.Interfaces;

public interface IWishlistRepository
{
    Task<List<WishlistGameResponseDto>> GetMyWishlistAsync(Guid userId);
    Task<WishlistGameResponseDto?> AddGameAsync(Guid userId, Guid gameId);
    Task<bool> RemoveGameAsync(Guid userId, Guid gameId);
    Task<bool> GameExistsAsync(Guid gameId);
    Task<bool> UserAlreadyHasGameInWishlistAsync(Guid userId, Guid gameId);
}