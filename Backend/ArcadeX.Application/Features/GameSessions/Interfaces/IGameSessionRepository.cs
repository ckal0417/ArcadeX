using ArcadeX.Application.Features.GameSessions.DTOs;

namespace ArcadeX.Application.Features.GameSessions.Interfaces;

public interface IGameSessionRepository
{
    
    Task<List<GameSessionResponseDto>> GetMineAsync(Guid userId);
    Task<GameSessionResponseDto?> StartAsync(Guid userId, StartGameSessionDto dto);
    Task<GameSessionResponseDto?> EndAsync(Guid userId, Guid sessionId);
    Task<bool> UserOwnsGameAsync(Guid userId, Guid gameId);
    Task<bool> HasActiveSessionAsync(Guid userId, Guid gameId);

}