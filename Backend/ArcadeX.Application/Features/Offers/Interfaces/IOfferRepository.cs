using ArcadeX.Application.Features.Offers.DTOs;

namespace ArcadeX.Application.Features.Offers.Interfaces;

public interface IOfferRepository
{

    Task<List<OfferResponseDto>> GetAllAsync();
    Task<OfferResponseDto?> GetByIdAsync(int id);
    Task<OfferResponseDto?> CreateAsync(CreateOfferDto dto);
    Task<OfferResponseDto?> UpdateAsync(int id, UpdateOfferDto dto);
    Task<bool> DeleteAsync(int id);
    Task<bool> GameExistsAsync(Guid gameId);
    
}