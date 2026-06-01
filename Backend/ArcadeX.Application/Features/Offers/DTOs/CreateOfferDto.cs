namespace ArcadeX.Application.Features.Offers.DTOs;

public class CreateOfferDto
{

    public Guid GameId { get; set; }
    public decimal DiscountPct { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    
}