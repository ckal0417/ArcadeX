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
using ArcadeX.Application.Features.Reviews.Interfaces;
using ArcadeX.Application.Features.Reviews.Services;
using ArcadeX.Persistence.Features.Reviews.Repositories;
using ArcadeX.Application.Features.Wishlist.Interfaces;
using ArcadeX.Application.Features.Wishlist.Services;
using ArcadeX.Persistence.Features.Wishlist.Repositories;
using ArcadeX.Application.Features.Achievements.Interfaces;
using ArcadeX.Application.Features.Achievements.Services;
using ArcadeX.Persistence.Features.Achievements.Repositories;
using ArcadeX.Application.Features.Offers.Interfaces;
using ArcadeX.Application.Features.Offers.Services;
using ArcadeX.Persistence.Features.Offers.Repositories;
using ArcadeX.Application.Features.ReviewComments.Interfaces;
using ArcadeX.Application.Features.ReviewComments.Services;
using ArcadeX.Persistence.Features.ReviewComments.Repositories;
using ArcadeX.Application.Features.Friends.Interfaces;
using ArcadeX.Application.Features.Friends.Services;
using ArcadeX.Persistence.Features.Friends.Repositories;
using ArcadeX.Application.Features.GameSessions.Interfaces;
using ArcadeX.Application.Features.GameSessions.Services;
using ArcadeX.Persistence.Features.GameSessions.Repositories;


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
builder.Services.AddScoped<IReviewService, ReviewService>();
builder.Services.AddScoped<IReviewRepository, ReviewRepository>();
builder.Services.AddScoped<IWishlistService, WishlistService>();
builder.Services.AddScoped<IWishlistRepository, WishlistRepository>();
builder.Services.AddScoped<IAchievementService, AchievementService>();
builder.Services.AddScoped<IAchievementRepository, AchievementRepository>();
builder.Services.AddScoped<IOfferService, OfferService>();
builder.Services.AddScoped<IOfferRepository, OfferRepository>();
builder.Services.AddScoped<IReviewCommentService, ReviewCommentService>();
builder.Services.AddScoped<IReviewCommentRepository, ReviewCommentRepository>();
builder.Services.AddScoped<IFriendService, FriendService>();
builder.Services.AddScoped<IFriendRepository, FriendRepository>();
builder.Services.AddScoped<IGameSessionService, GameSessionService>();
builder.Services.AddScoped<IGameSessionRepository, GameSessionRepository>();



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