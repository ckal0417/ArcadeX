using ArcadeX.Application.Common.Exceptions;
using ArcadeX.Application.Features.GameSessions.DTOs;
using ArcadeX.Application.Features.GameSessions.Interfaces;

namespace ArcadeX.Application.Features.GameSessions.Services;

public class GameSessionService : IGameSessionService
{
    private readonly IGameSessionRepository _gameSessionRepository;

    public GameSessionService(IGameSessionRepository gameSessionRepository)
    {
        _gameSessionRepository = gameSessionRepository;
    }

    public async Task<List<GameSessionResponseDto>> GetMineAsync(Guid userId)
    {
        return await _gameSessionRepository.GetMineAsync(userId);
    }

    public async Task<GameSessionResponseDto> StartAsync(Guid userId, StartGameSessionDto dto)
    {
        var ownsGame = await _gameSessionRepository.UserOwnsGameAsync(userId, dto.GameId);

        if (!ownsGame)
        {
            throw new BadRequestException("User must own the game before starting a session");
        }

        var hasActiveSession = await _gameSessionRepository.HasActiveSessionAsync(
            userId,
            dto.GameId
        );

        if (hasActiveSession)
        {
            throw new BadRequestException("User already has an active session for this game");
        }

        var session = await _gameSessionRepository.StartAsync(userId, dto);

        if (session is null)
        {
            throw new BadRequestException("Could not start game session");
        }

        return session;
    }

    public async Task<GameSessionResponseDto> EndAsync(Guid userId, Guid sessionId)
    {
        var session = await _gameSessionRepository.EndAsync(userId, sessionId);

        if (session is null)
        {
            throw new BadRequestException("Active session not found");
        }

        return session;
    }
}