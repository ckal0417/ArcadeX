using ArcadeX.Application.Features.Genres.DTOs;

namespace ArcadeX.Application.Features.Genres.Interfaces;

public interface IGenreService
{
    Task<List<GenreResponseDto>> GetAllAsync();
    Task<GenreResponseDto> CreateAsync(CreateGenreDto dto);
}