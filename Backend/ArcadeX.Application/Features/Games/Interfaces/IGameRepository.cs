using ArcadeX.Application.Features.Games.DTOs;

namespace ArcadeX.Application.Features.Games.Interfaces;

public interface IGameRepository
{
    Task<List<GameResponseDto>> GetAllAsync();
    Task<GameResponseDto?> GetByIdAsync(Guid id);
    Task<GameResponseDto> CreateAsync(CreateGameDto dto, Guid ownerId);
    Task<GameResponseDto?> UpdateAsync(Guid id, UpdateGameDto dto);
    Task<bool> DeleteAsync(Guid id);
    
}