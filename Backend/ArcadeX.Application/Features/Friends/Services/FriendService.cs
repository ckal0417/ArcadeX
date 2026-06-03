using ArcadeX.Application.Common.Exceptions;
using ArcadeX.Application.Features.Friends.DTOs;
using ArcadeX.Application.Features.Friends.Interfaces;

namespace ArcadeX.Application.Features.Friends.Services;

public class FriendService : IFriendService
{
    private readonly IFriendRepository _friendRepository;

    public FriendService(IFriendRepository friendRepository)
    {
        _friendRepository = friendRepository;
    }

    public async Task<List<FriendResponseDto>> GetMineAsync(Guid userId)
    {
        return await _friendRepository.GetMineAsync(userId);
    }

    public async Task<FriendResponseDto> SendRequestAsync(Guid userId, Guid friendId)
    {
        if (userId == friendId)
        {
            throw new BadRequestException("You cannot send a friend request to yourself");
        }

        var userExists = await _friendRepository.UserExistsAsync(friendId);

        if (!userExists)
        {
            throw new BadRequestException("User does not exist");
        }

        var relationshipExists = await _friendRepository.RelationshipExistsAsync(
            userId,
            friendId
        );

        if (relationshipExists)
        {
            throw new BadRequestException("Friend relationship already exists");
        }

        var friend = await _friendRepository.SendRequestAsync(userId, friendId);

        if (friend is null)
        {
            throw new BadRequestException("Could not send friend request");
        }

        return friend;
    }

    public async Task<FriendResponseDto> AcceptRequestAsync(Guid userId, Guid friendId)
    {
        var friend = await _friendRepository.AcceptRequestAsync(userId, friendId);

        if (friend is null)
        {
            throw new BadRequestException("Friend request does not exist");
        }

        return friend;
    }

    public async Task<bool> RejectRequestAsync(Guid userId, Guid friendId)
    {
        return await _friendRepository.RejectRequestAsync(userId, friendId);
    }

    public async Task<bool> CancelRequestAsync(Guid userId, Guid friendId)
    {
        return await _friendRepository.CancelRequestAsync(userId, friendId);
    }

    public async Task<bool> DeleteAsync(Guid userId, Guid friendId)
    {
        return await _friendRepository.DeleteAsync(userId, friendId);
    }
}