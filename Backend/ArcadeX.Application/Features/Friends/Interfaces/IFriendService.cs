using ArcadeX.Application.Features.Friends.DTOs;

namespace ArcadeX.Application.Features.Friends.Interfaces;

public interface IFriendService
{

    Task<List<FriendResponseDto>> GetMineAsync(Guid userId);
    Task<FriendResponseDto> SendRequestAsync(Guid userId, Guid friendId);
    Task<FriendResponseDto> AcceptRequestAsync(Guid userId, Guid friendId);
    Task<bool> DeleteAsync(Guid userId, Guid friendId);
    
}