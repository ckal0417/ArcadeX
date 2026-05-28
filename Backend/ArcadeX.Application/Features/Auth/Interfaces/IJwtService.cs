namespace ArcadeX.Application.Features.Auth.Interfaces;

public interface IJwtService
{
    string GenerateToken(
        Guid userId,
        string username,
        string email,
        List<string> roles
    );
}