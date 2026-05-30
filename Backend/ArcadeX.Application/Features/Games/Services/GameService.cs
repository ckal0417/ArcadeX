using ArcadeX.Application.Common.Exceptions;
using ArcadeX.Application.Features.Games.DTOs;
using ArcadeX.Application.Features.Games.Interfaces;

namespace ArcadeX.Application.Features.Games.Services;

public class GameService : IGameService
{
    private readonly IGameRepository _gameRepository;

    public GameService(IGameRepository gameRepository)
    {
        _gameRepository = gameRepository;
    }

    public async Task<List<GameResponseDto>> GetAllAsync()
    {
        return await _gameRepository.GetAllAsync();
    }

    public async Task<GameResponseDto?> GetByIdAsync(Guid id)
    {
        return await _gameRepository.GetByIdAsync(id);
    }

    public async Task<GameResponseDto> CreateAsync(CreateGameDto dto, Guid ownerId)
    {
        if (dto.Price < 0)
        {
            throw new BadRequestException("Price cannot be negative");
        }

        return await _gameRepository.CreateAsync(dto, ownerId);
    }

    public async Task<GameResponseDto?> UpdateAsync(Guid id, UpdateGameDto dto)
    {
        if (dto.Price < 0)
        {
            throw new BadRequestException("Price cannot be negative");
        }

        return await _gameRepository.UpdateAsync(id, dto);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        return await _gameRepository.DeleteAsync(id);
    }
}