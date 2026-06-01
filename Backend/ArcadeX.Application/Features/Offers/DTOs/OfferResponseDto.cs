namespace ArcadeX.Application.Features.Offers.DTOs;

public class OfferResponseDto
{
    
    public int OfferId { get; set; }
    public Guid GameId { get; set; }
    public string GameTitle { get; set; } = string.Empty;
    public decimal OriginalPrice { get; set; }
    public decimal DiscountPct { get; set; }
    public decimal FinalPrice { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }

}