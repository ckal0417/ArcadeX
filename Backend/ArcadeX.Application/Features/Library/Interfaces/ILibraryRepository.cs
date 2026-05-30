using ArcadeX.Application.Features.Library.DTOs;

namespace ArcadeX.Application.Features.Library.Interfaces;

public interface ILibraryRepository
{

    Task<List<LibraryGameResponseDto>> GetMyLibraryAsync(Guid userId);
    Task<LibraryGameResponseDto?> AddGameAsync(Guid userId, Guid gameId);
    Task<bool> UserOwnsGameAsync(Guid userId, Guid gameId);
    Task<bool> GameExistsAsync(Guid gameId);
    
}