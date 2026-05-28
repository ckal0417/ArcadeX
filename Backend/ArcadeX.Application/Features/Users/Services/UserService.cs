using ArcadeX.Application.Features.Users.DTOs;
using ArcadeX.Application.Features.Users.Interfaces;
using ArcadeX.Application.Common.Exceptions;

namespace ArcadeX.Application.Features.Users.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<List<UserResponseDto>> GetAllAsync()
    {
        return await _userRepository.GetAllAsync();
    }

    public async Task<UserResponseDto?> GetByIdAsync(Guid id)
    {
        return await _userRepository.GetByIdAsync(id);
    }
    public async Task<UserResponseDto> CreateAsync(CreateUserDto dto)
    {
        var exists = await _userRepository.ExistsByUsernameOrEmailAsync(
            dto.Username,
            dto.Email
        );

        if (exists)
        {
            throw new BadRequestException("Username or email already exists");
        }

        var requestedRoles = dto.Roles
        .Select(role => role.Trim())
        .Where(role => !string.IsNullOrWhiteSpace(role))
        .Distinct()
        .ToList();

        if (!requestedRoles.Any())
        {
            requestedRoles = new List<string> { "User" };
        }

        var rolesExist = await _userRepository.RolesExistAsync(requestedRoles);

        if (!rolesExist)
        {
            throw new BadRequestException("One or more roles do not exist");
        }

        return await _userRepository.CreateAsync(dto);
    }


}