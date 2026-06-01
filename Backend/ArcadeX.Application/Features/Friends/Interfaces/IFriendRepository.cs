using ArcadeX.Application.Features.Friends.DTOs;

namespace ArcadeX.Application.Features.Friends.Interfaces;

public interface IFriendRepository
{

    Task<List<FriendResponseDto>> GetMineAsync(Guid userId);
    Task<FriendResponseDto?> SendRequestAsync(Guid userId, Guid friendId);
    Task<FriendResponseDto?> AcceptRequestAsync(Guid userId, Guid friendId);
    Task<bool> DeleteAsync(Guid userId, Guid friendId);
    Task<bool> UserExistsAsync(Guid userId);
    Task<bool> RelationshipExistsAsync(Guid userId, Guid friendId);
    
}