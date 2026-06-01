using ArcadeX.Application.Features.GameSessions.DTOs;

namespace ArcadeX.Application.Features.GameSessions.Interfaces;

public interface IGameSessionService
{

    Task<List<GameSessionResponseDto>> GetMineAsync(Guid userId);
    Task<GameSessionResponseDto> StartAsync(Guid userId, StartGameSessionDto dto);
    Task<GameSessionResponseDto> EndAsync(Guid userId, Guid sessionId);
    
}