using ArcadeX.Application.Features.Library.DTOs;
using ArcadeX.Application.Features.Library.Interfaces;
using ArcadeX.Persistence.Context;
using ArcadeX.Persistence.Entities;
using Microsoft.EntityFrameworkCore;

namespace ArcadeX.Persistence.Features.Library.Repositories;

public class LibraryRepository : ILibraryRepository
{
    private readonly ArcadeXDbContext _context;

    public LibraryRepository(ArcadeXDbContext context)
    {
        _context = context;
    }

    public async Task<List<LibraryGameResponseDto>> GetMyLibraryAsync(Guid userId)
    {
        return await _context.UserGames
            .Where(userGame => userGame.UserId == userId)
            .Include(userGame => userGame.Game)
            .ThenInclude(game => game.GameGenres)
            .ThenInclude(gameGenre => gameGenre.Genre)
            .Select(userGame => new LibraryGameResponseDto
            {
                GameId = userGame.GameId,
                Title = userGame.Game.Title,
                Description = userGame.Game.Description,
                Price = userGame.Game.Price,
                PurchaseDate = userGame.PurchaseDate,
                PlayTimeMinutes = userGame.PlayTimeMinutes,
                Genres = userGame.Game.GameGenres
                    .Select(gameGenre => gameGenre.Genre.Name)
                    .ToList()
            })
            .ToListAsync();
    }

    public async Task<LibraryGameResponseDto?> AddGameAsync(Guid userId, Guid gameId)
    {
        var userGame = new UserGame
        {
            UserId = userId,
            GameId = gameId,
            PurchaseDate = DateTime.UtcNow,
            PlayTimeMinutes = 0
        };

        _context.UserGames.Add(userGame);

        await _context.SaveChangesAsync();

        return await _context.UserGames
            .Where(item =>
                item.UserId == userId &&
                item.GameId == gameId
            )
            .Include(item => item.Game)
            .ThenInclude(game => game.GameGenres)
            .ThenInclude(gameGenre => gameGenre.Genre)
            .Select(item => new LibraryGameResponseDto
            {
                GameId = item.GameId,
                Title = item.Game.Title,
                Description = item.Game.Description,
                Price = item.Game.Price,
                PurchaseDate = item.PurchaseDate,
                PlayTimeMinutes = item.PlayTimeMinutes,
                Genres = item.Game.GameGenres
                    .Select(gameGenre => gameGenre.Genre.Name)
                    .ToList()
            })
            .FirstOrDefaultAsync();
    }

    public async Task<bool> UserOwnsGameAsync(Guid userId, Guid gameId)
    {
        return await _context.UserGames
            .AnyAsync(userGame =>
                userGame.UserId == userId &&
                userGame.GameId == gameId
            );
    }

    public async Task<bool> GameExistsAsync(Guid gameId)
    {
        return await _context.Games
            .AnyAsync(game => game.Id == gameId);
    }
}