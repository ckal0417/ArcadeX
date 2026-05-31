using ArcadeX.Application.Common.Exceptions;
using ArcadeX.Application.Features.Genres.DTOs;
using ArcadeX.Application.Features.Genres.Interfaces;

namespace ArcadeX.Application.Features.Genres.Services;

public class GenreService : IGenreService
{
    private readonly IGenreRepository _genreRepository;

    public GenreService(IGenreRepository genreRepository)
    {
        _genreRepository = genreRepository;
    }

    public async Task<List<GenreResponseDto>> GetAllAsync()
    {
        return await _genreRepository.GetAllAsync();
    }

    public async Task<GenreResponseDto> CreateAsync(CreateGenreDto dto)
    {
        var name = dto.Name.Trim();

        if (string.IsNullOrWhiteSpace(name))
        {
            throw new BadRequestException("Genre name is required");
        }

        var exists = await _genreRepository.ExistsByNameAsync(name);

        if (exists)
        {
            throw new BadRequestException("Genre already exists");
        }

        return await _genreRepository.CreateAsync(new CreateGenreDto
        {
            Name = name
        });
    }
}