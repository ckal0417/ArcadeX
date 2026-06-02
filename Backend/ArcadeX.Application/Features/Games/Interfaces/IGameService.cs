using ArcadeX.Application.Features.Games.DTOs;

namespace ArcadeX.Application.Features.Games.Interfaces;

public interface IGameService
{

    Task<List<GameResponseDto>> GetAllAsync();
    Task<GameResponseDto?> GetByIdAsync(Guid id);
    Task<GameResponseDto> CreateAsync(CreateGameDto dto, Guid ownerId);
    Task<GameResponseDto?> UpdateAsync(
        Guid id,
        UpdateGameDto dto,
        Guid userId,
        bool isAdmin
    );
    Task<bool> DeleteAsync(
        Guid id,
        Guid userId,
        bool isAdmin
    );
    
}