using ArcadeX.Application.Features.Genres.DTOs;
using ArcadeX.Application.Features.Genres.Interfaces;
using ArcadeX.Persistence.Context;
using ArcadeX.Persistence.Entities;
using Microsoft.EntityFrameworkCore;

namespace ArcadeX.Persistence.Features.Genres.Repositories;

public class GenreRepository : IGenreRepository
{
    private readonly ArcadeXDbContext _context;

    public GenreRepository(ArcadeXDbContext context)
    {
        _context = context;
    }

    public async Task<List<GenreResponseDto>> GetAllAsync()
    {
        return await _context.Genres.Select(genre => new GenreResponseDto
        {
            Id = genre.Id,
            Name = genre.Name
        }).ToListAsync();
    }

    public async Task<GenreResponseDto> CreateAsync(CreateGenreDto dto)
    {
        var genre = new Genre
        {
            Id = Guid.NewGuid(),
            Name = dto.Name
        };

        _context.Genres.Add(genre);

        await _context.SaveChangesAsync();

        return new GenreResponseDto
        {
            Id = genre.Id,
            Name = genre.Name
        };
    }

    public async Task<bool> ExistsByNameAsync(string name)
    {
        return await _context.Genres.AnyAsync(genre => genre.Name == name);
    }
}