using ArcadeX.Application.Common.Exceptions;
using ArcadeX.Application.Features.Auth.DTOs;
using ArcadeX.Application.Features.Auth.Interfaces;

namespace ArcadeX.Application.Features.Auth.Services;

public class AuthService : IAuthService
{
    private readonly IAuthRepository _authRepository;

    public AuthService(IAuthRepository authRepository)
    {
        _authRepository = authRepository;
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
    {
        var response = await _authRepository.LoginAsync(dto);

        if (response is null)
        {
            throw new BadRequestException("Invalid email or password");
        }

        return response;
    }
}