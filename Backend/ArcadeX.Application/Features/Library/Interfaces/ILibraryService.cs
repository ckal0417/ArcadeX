using ArcadeX.Application.Features.Library.DTOs;

namespace ArcadeX.Application.Features.Library.Interfaces;

public interface ILibraryService
{

    Task<List<LibraryGameResponseDto>> GetMyLibraryAsync(Guid userId);
    Task<LibraryGameResponseDto> AddGameAsync(Guid userId, Guid gameId);
    
}