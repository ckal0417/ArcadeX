using ArcadeX.Application.Features.Auth.DTOs;

namespace ArcadeX.Application.Features.Auth.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto> LoginAsync(LoginDto dto);
}