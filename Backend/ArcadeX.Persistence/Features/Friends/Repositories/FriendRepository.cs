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
                UserId = friend.UserId,
                Username = friend.User.Username,
                FriendId = friend.FriendId,
                FriendUsername = friend.FriendUser.Username,
                Status = friend.Status,
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

        return await GetRelationshipAsync(userId, friendId);
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

        return await GetRelationshipAsync(friend.UserId, friend.FriendId);
    }

    public async Task<bool> DeleteAsync(Guid userId, Guid friendId)
    {
        var friend = await _context.Friends
            .FirstOrDefaultAsync(friend =>
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

    private async Task<FriendResponseDto?> GetRelationshipAsync(Guid userId, Guid friendId)
    {
        return await _context.Friends
            .Where(friend =>
                friend.UserId == userId &&
                friend.FriendId == friendId
            )
            .Include(friend => friend.User)
            .Include(friend => friend.FriendUser)
            .Select(friend => new FriendResponseDto
            {
                UserId = friend.UserId,
                Username = friend.User.Username,
                FriendId = friend.FriendId,
                FriendUsername = friend.FriendUser.Username,
                Status = friend.Status,
                CreatedAt = friend.CreatedAt
            })
            .FirstOrDefaultAsync();
    }
}