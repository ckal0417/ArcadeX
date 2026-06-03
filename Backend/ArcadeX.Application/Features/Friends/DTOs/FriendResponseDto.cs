namespace ArcadeX.Application.Features.Friends.DTOs;

public class FriendResponseDto
{
    public Guid UserId { get; set; }
    public string Username { get; set; } = string.Empty;

    public Guid FriendId { get; set; }
    public string FriendUsername { get; set; } = string.Empty;

    public string Status { get; set; } = string.Empty;

    // incoming = me enviaron solicitud
    // outgoing = yo envié solicitud
    // accepted = ya son amigos
    public string Direction { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }
}