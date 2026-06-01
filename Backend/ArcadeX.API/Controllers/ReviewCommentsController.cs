using System.Security.Claims;
using ArcadeX.Application.Features.ReviewComments.DTOs;
using ArcadeX.Application.Features.ReviewComments.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ArcadeX.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewCommentsController : ControllerBase
{
    private readonly IReviewCommentService _reviewCommentService;

    public ReviewCommentsController(IReviewCommentService reviewCommentService)
    {
        _reviewCommentService = reviewCommentService;
    }

    [HttpGet("review/{reviewId:guid}")]
    public async Task<IActionResult> GetByReview(Guid reviewId)
    {
        var comments = await _reviewCommentService.GetByReviewAsync(reviewId);

        return Ok(comments);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create(CreateReviewCommentDto dto)
    {
        var userId = Guid.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!
        );

        var comment = await _reviewCommentService.CreateAsync(userId, dto);

        return Ok(comment);
    }

    [HttpPut("{id:int}")]
    [Authorize]
    public async Task<IActionResult> Update(int id, UpdateReviewCommentDto dto)
    {
        var userId = Guid.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!
        );

        var comment = await _reviewCommentService.UpdateAsync(userId, id, dto);

        if (comment is null)
        {
            return NotFound(new
            {
                message = "Comment not found or user is not owner"
            });
        }

        return Ok(comment);
    }

    [HttpDelete("{id:int}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = Guid.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)!
        );

        var isAdmin = User.IsInRole("Admin");

        var deleted = await _reviewCommentService.DeleteAsync(userId, id, isAdmin);

        if (!deleted)
        {
            return NotFound(new
            {
                message = "Comment not found or user is not allowed to delete it"
            });
        }

        return NoContent();
    }
}