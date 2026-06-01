using ArcadeX.Application.Features.Offers.DTOs;
using ArcadeX.Application.Features.Offers.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ArcadeX.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OffersController : ControllerBase
{
    private readonly IOfferService _offerService;

    public OffersController(IOfferService offerService)
    {
        _offerService = offerService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var offers = await _offerService.GetAllAsync();

        return Ok(offers);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var offer = await _offerService.GetByIdAsync(id);

        if (offer is null)
        {
            return NotFound(new
            {
                message = "Offer not found"
            });
        }

        return Ok(offer);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Developer,Publisher")]
    public async Task<IActionResult> Create(CreateOfferDto dto)
    {
        var offer = await _offerService.CreateAsync(dto);

        return CreatedAtAction(
            nameof(GetById),
            new { id = offer.OfferId },
            offer
        );
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin,Developer,Publisher")]
    public async Task<IActionResult> Update(int id, UpdateOfferDto dto)
    {
        var offer = await _offerService.UpdateAsync(id, dto);

        if (offer is null)
        {
            return NotFound(new
            {
                message = "Offer not found"
            });
        }

        return Ok(offer);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin,Developer,Publisher")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _offerService.DeleteAsync(id);

        if (!deleted)
        {
            return NotFound(new
            {
                message = "Offer not found"
            });
        }

        return NoContent();
    }
}