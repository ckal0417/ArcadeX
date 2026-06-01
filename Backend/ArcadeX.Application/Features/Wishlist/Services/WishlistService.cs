using ArcadeX.Application.Common.Exceptions;
using ArcadeX.Application.Features.Wishlist.DTOs;
using ArcadeX.Application.Features.Wishlist.Interfaces;

namespace ArcadeX.Application.Features.Wishlist.Services;

public class WishlistService : IWishlistService
{
    private readonly IWishlistRepository _wishlistRepository;

    public WishlistService(IWishlistRepository wishlistRepository)
    {
        _wishlistRepository = wishlistRepository;
    }

    public async Task<List<WishlistGameResponseDto>> GetMyWishlistAsync(Guid userId)
    {
        return await _wishlistRepository.GetMyWishlistAsync(userId);
    }

    public async Task<WishlistGameResponseDto> AddGameAsync(Guid userId, Guid gameId)
    {
        var gameExists = await _wishlistRepository.GameExistsAsync(gameId);

        if (!gameExists)
        {
            throw new BadRequestException("Game does not exist");
        }

        var alreadyExists = await _wishlistRepository
            .UserAlreadyHasGameInWishlistAsync(userId, gameId);

        if (alreadyExists)
        {
            throw new BadRequestException("Game is already in wishlist");
        }

        var game = await _wishlistRepository.AddGameAsync(userId, gameId);

        if (game is null)
        {
            throw new BadRequestException("Could not add game to wishlist");
        }

        return game;
    }

    public async Task<bool> RemoveGameAsync(Guid userId, Guid gameId)
    {
        return await _wishlistRepository.RemoveGameAsync(userId, gameId);
    }
}