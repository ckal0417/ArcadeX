using ArcadeX.Application.Features.Games.DTOs;
using ArcadeX.Application.Features.Games.Interfaces;
using ArcadeX.Persistence.Context;
using ArcadeX.Persistence.Entities;
using Microsoft.EntityFrameworkCore;

namespace ArcadeX.Persistence.Features.Games.Repositories;

public class GameRepository : IGameRepository
{
    private readonly ArcadeXDbContext _context;

    public GameRepository(ArcadeXDbContext context)
    {
        _context = context;
    }

    public async Task<List<GameResponseDto>> GetAllAsync()
    {
        return await _context.Games
            .Include(game => game.Owner)
            .Include(game => game.GameGenres)
            .ThenInclude(gameGenre => gameGenre.Genre)
            .Select(game => new GameResponseDto
            {
                Id = game.Id,
                Title = game.Title,
                Description = game.Description,
                Price = game.Price,
                ReleaseDate = game.ReleaseDate,
                OwnerId = game.OwnerId,
                OwnerUsername = game.Owner.Username,
                Genres = game.GameGenres.Select(gameGenre => gameGenre.Genre.Name).ToList()
            })
            .ToListAsync();
    }

    public async Task<GameResponseDto?> GetByIdAsync(Guid id)
    {
        return await _context.Games
            .Where(game => game.Id == id)
            .Include(game => game.Owner)
            .Include(game => game.GameGenres)
            .ThenInclude(gameGenre => gameGenre.Genre)
            .Select(game => new GameResponseDto
            {
                Id = game.Id,
                Title = game.Title,
                Description = game.Description,
                Price = game.Price,
                ReleaseDate = game.ReleaseDate,
                OwnerId = game.OwnerId,
                OwnerUsername = game.Owner.Username,
                Genres = game.GameGenres.Select(gameGenre => gameGenre.Genre.Name).ToList()
            }).FirstOrDefaultAsync();
    }

    public async Task<GameResponseDto> CreateAsync(CreateGameDto dto, Guid ownerId)
    {
        var game = new Game
        {
            Id = Guid.NewGuid(),
            Title = dto.Title,
            Description = dto.Description,
            Price = dto.Price,
            ReleaseDate = dto.ReleaseDate,
            OwnerId = ownerId
        };

        var requestedGenres = dto.Genres
            .Select(genre => genre.Trim())
            .Where(genre => !string.IsNullOrWhiteSpace(genre))
            .Distinct()
            .ToList();

        var genres = await _context.Genres
            .Where(genre => requestedGenres.Contains(genre.Name))
            .ToListAsync();

        _context.Games.Add(game);

        foreach (var genre in genres)
        {
            _context.GameGenres.Add(new GameGenre
            {
                GameId = game.Id,
                GenreId = genre.Id
            });
        }

        await _context.SaveChangesAsync();

        return (await GetByIdAsync(game.Id))!;
    }

    public async Task<GameResponseDto?> UpdateAsync(Guid id, UpdateGameDto dto)
    {
        var game = await _context.Games
            .Include(game => game.GameGenres)
            .FirstOrDefaultAsync(game => game.Id == id);

        if (game is null)
        {
            return null;
        }

        game.Title = dto.Title;
        game.Description = dto.Description;
        game.Price = dto.Price;
        game.ReleaseDate = dto.ReleaseDate;

        var requestedGenres = dto.Genres
            .Select(genre => genre.Trim())
            .Where(genre => !string.IsNullOrWhiteSpace(genre))
            .Distinct()
            .ToList();

        var genres = await _context.Genres
            .Where(genre => requestedGenres.Contains(genre.Name))
            .ToListAsync();

        _context.GameGenres.RemoveRange(game.GameGenres);

        foreach (var genre in genres)
        {
            game.GameGenres.Add(new GameGenre
            {
                GameId = game.Id,
                GenreId = genre.Id
            });
        }

        await _context.SaveChangesAsync();

        return await GetByIdAsync(game.Id);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var game = await _context.Games
            .FirstOrDefaultAsync(game => game.Id == id);

        if (game is null)
        {
            return false;
        }

        _context.Games.Remove(game);

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> IsOwnerAsync(Guid gameId, Guid userId)
    {
        return await _context.Games
            .AnyAsync(game =>
                game.Id == gameId &&
                game.OwnerId == userId
            );
    }
}