using ArcadeX.Application.Features.Auth.DTOs;

namespace ArcadeX.Application.Features.Auth.Interfaces;

public interface IAuthRepository
{
    Task<AuthResponseDto?> LoginAsync(LoginDto dto);
}