using ArcadeX.Application.Features.Offers.DTOs;
using ArcadeX.Application.Features.Offers.Interfaces;
using ArcadeX.Persistence.Context;
using ArcadeX.Persistence.Entities;
using Microsoft.EntityFrameworkCore;

namespace ArcadeX.Persistence.Features.Offers.Repositories;

public class OfferRepository : IOfferRepository
{
    private readonly ArcadeXDbContext _context;

    public OfferRepository(ArcadeXDbContext context)
    {
        _context = context;
    }

    public async Task<List<OfferResponseDto>> GetAllAsync()
    {
        return await _context.Offers
            .Include(offer => offer.Game)
            .Select(offer => new OfferResponseDto
            {
                OfferId = offer.OfferId,
                GameId = offer.GameId,
                GameTitle = offer.Game.Title,
                OriginalPrice = offer.Game.Price,
                DiscountPct = offer.DiscountPct,
                FinalPrice = offer.Game.Price - (offer.Game.Price * offer.DiscountPct / 100),
                StartDate = offer.StartDate,
                EndDate = offer.EndDate
            })
            .ToListAsync();
    }

    public async Task<OfferResponseDto?> GetByIdAsync(int id)
    {
        return await _context.Offers
            .Where(offer => offer.OfferId == id)
            .Include(offer => offer.Game)
            .Select(offer => new OfferResponseDto
            {
                OfferId = offer.OfferId,
                GameId = offer.GameId,
                GameTitle = offer.Game.Title,
                OriginalPrice = offer.Game.Price,
                DiscountPct = offer.DiscountPct,
                FinalPrice = offer.Game.Price - (offer.Game.Price * offer.DiscountPct / 100),
                StartDate = offer.StartDate,
                EndDate = offer.EndDate
            })
            .FirstOrDefaultAsync();
    }

    public async Task<OfferResponseDto?> CreateAsync(CreateOfferDto dto)
    {
        var offer = new Offer
        {
            GameId = dto.GameId,
            DiscountPct = dto.DiscountPct,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate
        };

        _context.Offers.Add(offer);

        await _context.SaveChangesAsync();

        return await GetByIdAsync(offer.OfferId);
    }

    public async Task<OfferResponseDto?> UpdateAsync(int id, UpdateOfferDto dto)
    {
        var offer = await _context.Offers
            .FirstOrDefaultAsync(offer => offer.OfferId == id);

        if (offer is null)
        {
            return null;
        }

        offer.DiscountPct = dto.DiscountPct;
        offer.StartDate = dto.StartDate;
        offer.EndDate = dto.EndDate;

        await _context.SaveChangesAsync();

        return await GetByIdAsync(offer.OfferId);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var offer = await _context.Offers
            .FirstOrDefaultAsync(offer => offer.OfferId == id);

        if (offer is null)
        {
            return false;
        }

        _context.Offers.Remove(offer);

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> GameExistsAsync(Guid gameId)
    {
        return await _context.Games
            .AnyAsync(game => game.Id == gameId);
    }
}