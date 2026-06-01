using ArcadeX.Application.Features.Wishlist.DTOs;
using ArcadeX.Application.Features.Wishlist.Interfaces;
using ArcadeX.Persistence.Context;
using ArcadeX.Persistence.Entities;
using Microsoft.EntityFrameworkCore;

namespace ArcadeX.Persistence.Features.Wishlist.Repositories;

public class WishlistRepository : IWishlistRepository
{
    private readonly ArcadeXDbContext _context;

    public WishlistRepository(ArcadeXDbContext context)
    {
        _context = context;
    }

    public async Task<List<WishlistGameResponseDto>> GetMyWishlistAsync(Guid userId)
    {
        return await _context.Wishlist
            .Where(item => item.UserId == userId)
            .Include(item => item.Game)
            .ThenInclude(game => game.GameGenres)
            .ThenInclude(gameGenre => gameGenre.Genre)
            .Select(item => new WishlistGameResponseDto
            {
                GameId = item.GameId,
                Title = item.Game.Title,
                Description = item.Game.Description,
                Price = item.Game.Price,
                AddedAt = item.AddedAt,
                Genres = item.Game.GameGenres
                    .Select(gameGenre => gameGenre.Genre.Name)
                    .ToList()
            })
            .ToListAsync();
    }

    public async Task<WishlistGameResponseDto?> AddGameAsync(Guid userId, Guid gameId)
    {
        var item = new WishlistItem
        {
            UserId = userId,
            GameId = gameId,
            AddedAt = DateTime.UtcNow
        };

        _context.Wishlist.Add(item);

        await _context.SaveChangesAsync();

        return await _context.Wishlist
            .Where(wishlistItem =>
                wishlistItem.UserId == userId &&
                wishlistItem.GameId == gameId
            )
            .Include(wishlistItem => wishlistItem.Game)
            .ThenInclude(game => game.GameGenres)
            .ThenInclude(gameGenre => gameGenre.Genre)
            .Select(wishlistItem => new WishlistGameResponseDto
            {
                GameId = wishlistItem.GameId,
                Title = wishlistItem.Game.Title,
                Description = wishlistItem.Game.Description,
                Price = wishlistItem.Game.Price,
                AddedAt = wishlistItem.AddedAt,
                Genres = wishlistItem.Game.GameGenres
                    .Select(gameGenre => gameGenre.Genre.Name)
                    .ToList()
            })
            .FirstOrDefaultAsync();
    }

    public async Task<bool> RemoveGameAsync(Guid userId, Guid gameId)
    {
        var item = await _context.Wishlist
            .FirstOrDefaultAsync(wishlistItem =>
                wishlistItem.UserId == userId &&
                wishlistItem.GameId == gameId
            );

        if (item is null)
        {
            return false;
        }

        _context.Wishlist.Remove(item);

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> GameExistsAsync(Guid gameId)
    {
        return await _context.Games
            .AnyAsync(game => game.Id == gameId);
    }

    public async Task<bool> UserAlreadyHasGameInWishlistAsync(Guid userId, Guid gameId)
    {
        return await _context.Wishlist
            .AnyAsync(item =>
                item.UserId == userId &&
                item.GameId == gameId
            );
    }
}