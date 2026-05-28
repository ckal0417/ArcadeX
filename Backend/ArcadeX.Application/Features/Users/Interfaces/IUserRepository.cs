using ArcadeX.Application.Features.Users.DTOs;

namespace ArcadeX.Application.Features.Users.Interfaces;

public interface IUserRepository
{
    Task<List<UserResponseDto>> GetAllAsync();
    Task<UserResponseDto?> GetByIdAsync(Guid id);
    Task<UserResponseDto> CreateAsync(CreateUserDto dto);
    Task<bool> ExistsByUsernameOrEmailAsync(string username, string email);
    Task<bool> RolesExistAsync(List<string> roles);
    
}