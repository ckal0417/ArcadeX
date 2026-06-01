using System.Security.Claims;
using ArcadeX.Application.Features.Reviews.DTOs;
using ArcadeX.Application.Features.Reviews.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ArcadeX.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewsController : ControllerBase
{
    private readonly IReviewService _reviewService;

    public ReviewsController(IReviewService reviewService)
    {
        _reviewService = reviewService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var reviews = await _reviewService.GetAllAsync();
        return Ok(reviews);
    }

    [HttpGet("game/{gameId:guid}")]
    public async Task<IActionResult> GetByGame(Guid gameId)
    {
        var reviews = await _reviewService.GetByGameAsync(gameId);
        return Ok(reviews);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var review = await _reviewService.GetByIdAsync(id);
        if (review is null)
        {
            return NotFound(new
            {
                message = "Review not found"
            });
        }

        return Ok(review);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create(CreateReviewDto dto)
    {
        var userId = Guid.Parse( User.FindFirstValue(ClaimTypes.NameIdentifier)! );

        var review = await _reviewService.CreateAsync(userId, dto);
        return CreatedAtAction(
            nameof(GetById),
            new { id = review.Id },
            review
        );
    }

    [HttpPut("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> Update(Guid id, UpdateReviewDto dto)
    {
        var userId = Guid.Parse( User.FindFirstValue(ClaimTypes.NameIdentifier)! );
        var review = await _reviewService.UpdateAsync(userId, id, dto);
        if (review is null)
        {
            return NotFound(new{
                message = "Review not found or user is not owner"
            });
        }

        return Ok(review);
    }

    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> Delete(Guid id)
    {
        var userId = Guid.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!
        );

        var isAdmin = User.IsInRole("Admin");
        var deleted = await _reviewService.DeleteAsync(userId, id, isAdmin);
        if (!deleted)
        {
            return NotFound(new{
                message = "Review not found or user is not allowed to delete it"
            });
        }

        return NoContent();
    }
}