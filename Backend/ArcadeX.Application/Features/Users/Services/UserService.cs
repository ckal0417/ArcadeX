using ArcadeX.Application.Common.Exceptions;
using ArcadeX.Application.Common.Interfaces;
using ArcadeX.Application.Common.Security;
using ArcadeX.Application.Features.Users.DTOs;
using ArcadeX.Application.Features.Users.Interfaces;

namespace ArcadeX.Application.Features.Users.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IPasswordHasher _passwordHasher;

    public UserService(
        IUserRepository userRepository,
        IUnitOfWork unitOfWork,
        IPasswordHasher passwordHasher
    )
    {
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
        _passwordHasher = passwordHasher;
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
        await _unitOfWork.BeginTransactionAsync();

        try
        {
            var exists = await _userRepository.ExistsByUsernameOrEmailAsync(
                dto.Username,
                dto.Email
            );

            if (exists)
            {
                throw new BadRequestException("Username or email already exists");
            }

            var requestedRoles = NormalizeRoles(dto.Roles);

            var rolesExist = await _userRepository.RolesExistAsync(requestedRoles);

            if (!rolesExist)
            {
                throw new BadRequestException("One or more roles do not exist");
            }

            var secureDto = new CreateUserDto
            {
                Username = dto.Username,
                Email = dto.Email,
                Password = _passwordHasher.Hash(dto.Password),
                Country = dto.Country,
                Roles = dto.Roles
            };

            var user = await _userRepository.CreateAsync(secureDto, requestedRoles);

            await _unitOfWork.SaveChangesAsync();
            await _unitOfWork.CommitAsync();

            return user;
        }
        catch
        {
            await _unitOfWork.RollbackAsync();
            throw;
        }
    }

    public async Task<UserResponseDto?> UpdateAsync(Guid id, UpdateUserDto dto)
    {
        await _unitOfWork.BeginTransactionAsync();

        try
        {
            var exists = await _userRepository.ExistsByUsernameOrEmailForOtherUserAsync(
                id,
                dto.Username,
                dto.Email
            );

            if (exists)
            {
                throw new BadRequestException("Username or email already exists");
            }

            var requestedRoles = NormalizeRoles(dto.Roles);

            var rolesExist = await _userRepository.RolesExistAsync(requestedRoles);

            if (!rolesExist)
            {
                throw new BadRequestException("One or more roles do not exist");
            }

            var user = await _userRepository.UpdateAsync(id, dto, requestedRoles);

            await _unitOfWork.SaveChangesAsync();
            await _unitOfWork.CommitAsync();

            return user;
        }
        catch
        {
            await _unitOfWork.RollbackAsync();
            throw;
        }
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        await _unitOfWork.BeginTransactionAsync();

        try
        {
            var deleted = await _userRepository.DeleteAsync(id);

            await _unitOfWork.SaveChangesAsync();
            await _unitOfWork.CommitAsync();

            return deleted;
        }
        catch
        {
            await _unitOfWork.RollbackAsync();
            throw;
        }
    }

    private static List<string> NormalizeRoles(List<string> roles)
    {
        var requestedRoles = roles
            .Select(role => role.Trim())
            .Where(role => !string.IsNullOrWhiteSpace(role))
            .Distinct()
            .ToList();

        if (!requestedRoles.Any())
        {
            requestedRoles = new List<string> { "User" };
        }

        return requestedRoles;
    }
}