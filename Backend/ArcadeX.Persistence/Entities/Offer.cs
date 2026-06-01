namespace ArcadeX.Persistence.Entities;

public class Offer
{
    public int OfferId { get; set; }
    public Guid GameId { get; set; }
    public decimal DiscountPct { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public Game Game { get; set; } = null!;
    
}