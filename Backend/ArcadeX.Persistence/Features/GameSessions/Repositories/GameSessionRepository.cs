using ArcadeX.Application.Features.GameSessions.DTOs;
using ArcadeX.Application.Features.GameSessions.Interfaces;
using ArcadeX.Persistence.Context;
using ArcadeX.Persistence.Entities;
using Microsoft.EntityFrameworkCore;

namespace ArcadeX.Persistence.Features.GameSessions.Repositories;

public class GameSessionRepository : IGameSessionRepository
{
    private readonly ArcadeXDbContext _context;

    public GameSessionRepository(ArcadeXDbContext context)
    {
        _context = context;
    }

    public async Task<List<GameSessionResponseDto>> GetMineAsync(Guid userId)
    {
        return await _context.GameSessions
            .Where(session => session.UserId == userId)
            .Include(session => session.User)
            .Include(session => session.Game)
            .Select(session => new GameSessionResponseDto
            {
                Id = session.Id,
                UserId = session.UserId,
                Username = session.User.Username,
                GameId = session.GameId,
                GameTitle = session.Game.Title,
                StartTime = session.StartTime,
                EndTime = session.EndTime,
                DurationMinutes = session.EndTime.HasValue && session.StartTime.HasValue
                    ? (int)(session.EndTime.Value - session.StartTime.Value).TotalMinutes
                    : null
            })
            .ToListAsync();
    }

    public async Task<GameSessionResponseDto?> StartAsync(Guid userId, StartGameSessionDto dto)
    {
        var session = new GameSession
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            GameId = dto.GameId,
            StartTime = DateTime.UtcNow,
            EndTime = null
        };

        _context.GameSessions.Add(session);

        await _context.SaveChangesAsync();

        return await GetByIdAsync(session.Id);
    }

    public async Task<GameSessionResponseDto?> EndAsync(Guid userId, Guid sessionId)
    {
        var session = await _context.GameSessions
            .FirstOrDefaultAsync(session =>
                session.Id == sessionId &&
                session.UserId == userId &&
                session.EndTime == null
            );

        if (session is null)
        {
            return null;
        }

        session.EndTime = DateTime.UtcNow;

        var durationMinutes = session.StartTime.HasValue
            ? (int)(session.EndTime.Value - session.StartTime.Value).TotalMinutes
            : 0;

        var userGame = await _context.UserGames
            .FirstOrDefaultAsync(userGame =>
                userGame.UserId == userId &&
                userGame.GameId == session.GameId
            );

        if (userGame is not null)
        {
            userGame.PlayTimeMinutes += durationMinutes;
        }

        await _context.SaveChangesAsync();

        return await GetByIdAsync(session.Id);
    }

    public async Task<bool> UserOwnsGameAsync(Guid userId, Guid gameId)
    {
        return await _context.UserGames
            .AnyAsync(userGame =>
                userGame.UserId == userId &&
                userGame.GameId == gameId
            );
    }

    public async Task<bool> HasActiveSessionAsync(Guid userId, Guid gameId)
    {
        return await _context.GameSessions
            .AnyAsync(session =>
                session.UserId == userId &&
                session.GameId == gameId &&
                session.EndTime == null
            );
    }

    private async Task<GameSessionResponseDto?> GetByIdAsync(Guid id)
    {
        return await _context.GameSessions
            .Where(session => session.Id == id)
            .Include(session => session.User)
            .Include(session => session.Game)
            .Select(session => new GameSessionResponseDto
            {
                Id = session.Id,
                UserId = session.UserId,
                Username = session.User.Username,
                GameId = session.GameId,
                GameTitle = session.Game.Title,
                StartTime = session.StartTime,
                EndTime = session.EndTime,
                DurationMinutes = session.EndTime.HasValue && session.StartTime.HasValue
                    ? (int)(session.EndTime.Value - session.StartTime.Value).TotalMinutes
                    : null
            })
            .FirstOrDefaultAsync();
    }
}