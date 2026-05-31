using ArcadeX.Application.Features.Genres.DTOs;
using ArcadeX.Application.Features.Genres.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ArcadeX.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GenresController : ControllerBase
{
    private readonly IGenreService _genreService;

    public GenresController(IGenreService genreService)
    {
        _genreService = genreService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var genres = await _genreService.GetAllAsync();
        return Ok(genres);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create(CreateGenreDto dto)
    {
        var genre = await _genreService.CreateAsync(dto);
        return Ok(genre);
    }
}