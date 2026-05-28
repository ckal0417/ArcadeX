using ArcadeX.Application.Features.Users.DTOs;
using ArcadeX.Application.Features.Users.Interfaces;

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
        return await _userRepository.CreateAsync(dto);
    }
}