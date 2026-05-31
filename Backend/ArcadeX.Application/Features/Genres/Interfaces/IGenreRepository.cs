using ArcadeX.Application.Features.Genres.DTOs;

namespace ArcadeX.Application.Features.Genres.Interfaces;

public interface IGenreRepository
{
    Task<List<GenreResponseDto>> GetAllAsync();
    Task<GenreResponseDto> CreateAsync(CreateGenreDto dto);
    Task<bool> ExistsByNameAsync(string name);
}