using System.Text.Json.Serialization;
using ArcadeX.Persistence.Context;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using ArcadeX.Application.Features.Users.Interfaces;
using ArcadeX.Application.Features.Users.Services;
using ArcadeX.Persistence.Features.Users.Repositories;
using ArcadeX.API.Middlewares;
using ArcadeX.Application.Features.Auth.Interfaces;
using ArcadeX.Infrastructure.Features.Auth.Services;
using ArcadeX.Application.Features.Auth.Services;
using ArcadeX.Persistence.Features.Auth.Repositories;


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
    options.UseSqlServer( builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();

builder.Services.AddOpenApi();
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

var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();
app.UseCors("AllowFrontend");
app.MapOpenApi();
app.MapScalarApiReference();
app.MapControllers();
app.Run();