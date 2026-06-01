using ArcadeX.Application.Features.Offers.DTOs;

namespace ArcadeX.Application.Features.Offers.Interfaces;

public interface IOfferService
{
    
    Task<List<OfferResponseDto>> GetAllAsync();
    Task<OfferResponseDto?> GetByIdAsync(int id);
    Task<OfferResponseDto> CreateAsync(CreateOfferDto dto);
    Task<OfferResponseDto?> UpdateAsync(int id, UpdateOfferDto dto);
    Task<bool> DeleteAsync(int id);

}