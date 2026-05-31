using ArcadeX.API.Middlewares;
using ArcadeX.API.OpenApi;
using ArcadeX.Application.Features.Auth.Interfaces;
using ArcadeX.Application.Features.Auth.Services;
using ArcadeX.Application.Features.Games.Interfaces;
using ArcadeX.Application.Features.Games.Services;
using ArcadeX.Application.Features.Genres.Interfaces;
using ArcadeX.Application.Features.Genres.Services;
using ArcadeX.Application.Features.Library.Interfaces;
using ArcadeX.Application.Features.Library.Services;
using ArcadeX.Application.Features.Users.Interfaces;
using ArcadeX.Application.Features.Users.Services;
using ArcadeX.Infrastructure.Features.Auth.Services;
using ArcadeX.Persistence.Context;
using ArcadeX.Persistence.Features.Auth.Repositories;
using ArcadeX.Persistence.Features.Games.Repositories;
using ArcadeX.Persistence.Features.Genres.Repositories;
using ArcadeX.Persistence.Features.Library.Repositories;
using ArcadeX.Persistence.Features.Users.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;
using System.Text;


var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler =
            System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

builder.Services.AddDbContext<ArcadeXDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddOpenApi(options =>
{
    options.AddDocumentTransformer<BearerSecuritySchemeTransformer>();
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
        .AllowAnyOrigin()
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IAuthRepository, AuthRepository>();
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddScoped<IGameService, GameService>();
builder.Services.AddScoped<IGameRepository, GameRepository>();
builder.Services.AddScoped<IGenreService, GenreService>();
builder.Services.AddScoped<IGenreRepository, GenreRepository>();
builder.Services.AddScoped<ILibraryService, LibraryService>();
builder.Services.AddScoped<ILibraryRepository, LibraryRepository>();

var app = builder.Build();

app.MapGet("/health", () =>
{
    return Results.Ok("API funcionando");
});

app.UseMiddleware<ExceptionMiddleware>();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapOpenApi();
app.MapScalarApiReference();
app.MapControllers();
app.Run();