using ArcadeX.Application.Common.Exceptions;
using ArcadeX.Application.Features.Library.DTOs;
using ArcadeX.Application.Features.Library.Interfaces;

namespace ArcadeX.Application.Features.Library.Services;

public class LibraryService : ILibraryService
{
    private readonly ILibraryRepository _libraryRepository;

    public LibraryService(ILibraryRepository libraryRepository)
    {
        _libraryRepository = libraryRepository;
    }

    public async Task<List<LibraryGameResponseDto>> GetMyLibraryAsync(Guid userId)
    {
        return await _libraryRepository.GetMyLibraryAsync(userId);
    }

    public async Task<LibraryGameResponseDto> AddGameAsync(Guid userId, Guid gameId)
    {
        var gameExists = await _libraryRepository.GameExistsAsync(gameId);

        if (!gameExists)
        {
            throw new BadRequestException("Game does not exist");
        }

        var ownsGame = await _libraryRepository.UserOwnsGameAsync(userId, gameId);

        if (ownsGame)
        {
            throw new BadRequestException("User already owns this game");
        }

        var game = await _libraryRepository.AddGameAsync(userId, gameId);

        if (game is null)
        {
            throw new BadRequestException("Could not add game to library");
        }

        return game;
    }
}