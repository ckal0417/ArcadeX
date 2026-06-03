using ArcadeX.Application.Features.Friends.DTOs;
using ArcadeX.Application.Features.Friends.Interfaces;
using ArcadeX.Persistence.Context;
using ArcadeX.Persistence.Entities;
using Microsoft.EntityFrameworkCore;

namespace ArcadeX.Persistence.Features.Friends.Repositories;

public class FriendRepository : IFriendRepository
{
    private readonly ArcadeXDbContext _context;

    public FriendRepository(ArcadeXDbContext context)
    {
        _context = context;
    }

    public async Task<List<FriendResponseDto>> GetMineAsync(Guid userId)
    {
        return await _context.Friends
            .Where(friend =>
                friend.UserId == userId ||
                friend.FriendId == userId
            )
            .Include(friend => friend.User)
            .Include(friend => friend.FriendUser)
            .Select(friend => new FriendResponseDto
            {
                UserId = userId,

                Username = friend.UserId == userId
                    ? friend.User.Username
                    : friend.FriendUser.Username,

                FriendId = friend.UserId == userId
                    ? friend.FriendId
                    : friend.UserId,

                FriendUsername = friend.UserId == userId
                    ? friend.FriendUser.Username
                    : friend.User.Username,

                Status = friend.Status,

                Direction = friend.Status == "accepted"
                    ? "accepted"
                    : friend.UserId == userId
                        ? "outgoing"
                        : "incoming",

                CreatedAt = friend.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<FriendResponseDto?> SendRequestAsync(Guid userId, Guid friendId)
    {
        var friend = new Friend
        {
            UserId = userId,
            FriendId = friendId,
            Status = "pending",
            CreatedAt = DateTime.UtcNow
        };

        _context.Friends.Add(friend);

        await _context.SaveChangesAsync();

        return await GetRelationshipForUserAsync(userId, friendId);
    }

    public async Task<FriendResponseDto?> AcceptRequestAsync(Guid userId, Guid friendId)
    {
        var friend = await _context.Friends
            .FirstOrDefaultAsync(friend =>
                friend.UserId == friendId &&
                friend.FriendId == userId &&
                friend.Status == "pending"
            );

        if (friend is null)
        {
            return null;
        }

        friend.Status = "accepted";

        await _context.SaveChangesAsync();

        return await GetRelationshipForUserAsync(userId, friendId);
    }

    public async Task<bool> RejectRequestAsync(Guid userId, Guid friendId)
    {
        var friend = await _context.Friends
            .FirstOrDefaultAsync(friend =>
                friend.UserId == friendId &&
                friend.FriendId == userId &&
                friend.Status == "pending"
            );

        if (friend is null)
        {
            return false;
        }

        _context.Friends.Remove(friend);

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> CancelRequestAsync(Guid userId, Guid friendId)
    {
        var friend = await _context.Friends
            .FirstOrDefaultAsync(friend =>
                friend.UserId == userId &&
                friend.FriendId == friendId &&
                friend.Status == "pending"
            );

        if (friend is null)
        {
            return false;
        }

        _context.Friends.Remove(friend);

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeleteAsync(Guid userId, Guid friendId)
    {
        var friend = await _context.Friends
            .FirstOrDefaultAsync(friend =>
                friend.Status == "accepted" &&
                (
                    friend.UserId == userId &&
                    friend.FriendId == friendId
                )
                ||
                friend.Status == "accepted" &&
                (
                    friend.UserId == friendId &&
                    friend.FriendId == userId
                )
            );

        if (friend is null)
        {
            return false;
        }

        _context.Friends.Remove(friend);

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> UserExistsAsync(Guid userId)
    {
        return await _context.Users
            .AnyAsync(user => user.Id == userId);
    }

    public async Task<bool> RelationshipExistsAsync(Guid userId, Guid friendId)
    {
        return await _context.Friends
            .AnyAsync(friend =>
                (
                    friend.UserId == userId &&
                    friend.FriendId == friendId
                )
                ||
                (
                    friend.UserId == friendId &&
                    friend.FriendId == userId
                )
            );
    }

    private async Task<FriendResponseDto?> GetRelationshipForUserAsync(
        Guid userId,
        Guid friendId
    )
    {
        return await _context.Friends
            .Where(friend =>
                (
                    friend.UserId == userId &&
                    friend.FriendId == friendId
                )
                ||
                (
                    friend.UserId == friendId &&
                    friend.FriendId == userId
                )
            )
            .Include(friend => friend.User)
            .Include(friend => friend.FriendUser)
            .Select(friend => new FriendResponseDto
            {
                UserId = userId,

                Username = friend.UserId == userId
                    ? friend.User.Username
                    : friend.FriendUser.Username,

                FriendId = friend.UserId == userId
                    ? friend.FriendId
                    : friend.UserId,

                FriendUsername = friend.UserId == userId
                    ? friend.FriendUser.Username
                    : friend.User.Username,

                Status = friend.Status,

                Direction = friend.Status == "accepted"
                    ? "accepted"
                    : friend.UserId == userId
                        ? "outgoing"
                        : "incoming",

                CreatedAt = friend.CreatedAt
            })
            .FirstOrDefaultAsync();
    }
}