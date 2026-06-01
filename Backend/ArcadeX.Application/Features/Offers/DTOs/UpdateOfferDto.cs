namespace ArcadeX.Application.Features.Offers.DTOs;

public class UpdateOfferDto
{

    public decimal DiscountPct { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    
}