using ArcadeX.Application.Common.Exceptions;
using ArcadeX.Application.Features.Offers.DTOs;
using ArcadeX.Application.Features.Offers.Interfaces;

namespace ArcadeX.Application.Features.Offers.Services;

public class OfferService : IOfferService
{
    private readonly IOfferRepository _offerRepository;

    public OfferService(IOfferRepository offerRepository)
    {
        _offerRepository = offerRepository;
    }

    public async Task<List<OfferResponseDto>> GetAllAsync()
    {
        return await _offerRepository.GetAllAsync();
    }

    public async Task<OfferResponseDto?> GetByIdAsync(int id)
    {
        return await _offerRepository.GetByIdAsync(id);
    }

    public async Task<OfferResponseDto> CreateAsync(CreateOfferDto dto)
    {
        if (dto.DiscountPct < 0 || dto.DiscountPct > 100)
        {
            throw new BadRequestException("Discount must be between 0 and 100");
        }

        if (dto.StartDate.HasValue && dto.EndDate.HasValue && dto.EndDate < dto.StartDate)
        {
            throw new BadRequestException("End date cannot be before start date");
        }

        var gameExists = await _offerRepository.GameExistsAsync(dto.GameId);

        if (!gameExists)
        {
            throw new BadRequestException("Game does not exist");
        }

        var offer = await _offerRepository.CreateAsync(dto);

        if (offer is null)
        {
            throw new BadRequestException("Could not create offer");
        }

        return offer;
    }

    public async Task<OfferResponseDto?> UpdateAsync(int id, UpdateOfferDto dto)
    {
        if (dto.DiscountPct < 0 || dto.DiscountPct > 100)
        {
            throw new BadRequestException("Discount must be between 0 and 100");
        }

        if (dto.StartDate.HasValue && dto.EndDate.HasValue && dto.EndDate < dto.StartDate)
        {
            throw new BadRequestException("End date cannot be before start date");
        }

        return await _offerRepository.UpdateAsync(id, dto);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        return await _offerRepository.DeleteAsync(id);
    }
}