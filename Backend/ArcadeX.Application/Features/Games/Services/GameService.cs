using ArcadeX.Application.Common.Exceptions;
using ArcadeX.Application.Common.Interfaces;
using ArcadeX.Application.Features.Games.DTOs;
using ArcadeX.Application.Features.Games.Interfaces;

namespace ArcadeX.Application.Features.Games.Services;

public class GameService : IGameService
{
    private readonly IGameRepository _gameRepository;
    private readonly IUnitOfWork _unitOfWork;

    public GameService(
        IGameRepository gameRepository,
        IUnitOfWork unitOfWork
    )
    {
        _gameRepository = gameRepository;
        _unitOfWork = unitOfWork;
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

        await _unitOfWork.BeginTransactionAsync();

        try
        {
            var game = await _gameRepository.CreateAsync(dto, ownerId);

            await _unitOfWork.SaveChangesAsync();
            await _unitOfWork.CommitAsync();

            var savedGame = await _gameRepository.GetByIdAsync(game.Id);

            return savedGame!;
        }
        catch
        {
            await _unitOfWork.RollbackAsync();
            throw;
        }
    }

    public async Task<GameResponseDto?> UpdateAsync(
        Guid id,
        UpdateGameDto dto,
        Guid userId,
        bool isAdmin
    )
    {
        if (dto.Price < 0)
        {
            throw new BadRequestException("Price cannot be negative");
        }

        var gameExists = await _gameRepository.GetByIdAsync(id);

        if (gameExists is null)
        {
            return null;
        }

        var isOwner = await _gameRepository.IsOwnerAsync(id, userId);

        if (!isAdmin && !isOwner)
        {
            throw new BadRequestException("You can only edit your own games");
        }

        await _unitOfWork.BeginTransactionAsync();

        try
        {
            var game = await _gameRepository.UpdateAsync(id, dto);

            await _unitOfWork.SaveChangesAsync();
            await _unitOfWork.CommitAsync();

            return await _gameRepository.GetByIdAsync(id);
        }
        catch
        {
            await _unitOfWork.RollbackAsync();
            throw;
        }
    }

    public async Task<bool> DeleteAsync(
        Guid id,
        Guid userId,
        bool isAdmin
    )
    {
        var gameExists = await _gameRepository.GetByIdAsync(id);

        if (gameExists is null)
        {
            return false;
        }

        var isOwner = await _gameRepository.IsOwnerAsync(id, userId);

        if (!isAdmin && !isOwner)
        {
            throw new BadRequestException("You can only delete your own games");
        }

        await _unitOfWork.BeginTransactionAsync();

        try
        {
            var deleted = await _gameRepository.DeleteAsync(id);

            await _unitOfWork.SaveChangesAsync();
            await _unitOfWork.CommitAsync();

            return deleted;
        }
        catch
        {
            await _unitOfWork.RollbackAsync();
            throw;
        }
    }
}