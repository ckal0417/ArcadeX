using ArcadeX.Persistence.Configurations;
using ArcadeX.Persistence.Entities;
using Microsoft.EntityFrameworkCore;

namespace ArcadeX.Persistence.Context;

public class ArcadeXDbContext : DbContext
{
    public ArcadeXDbContext(DbContextOptions<ArcadeXDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<UserRole> UserRoles => Set<UserRole>();

    public DbSet<Game> Games => Set<Game>();
    public DbSet<Genre> Genres => Set<Genre>();
    public DbSet<GameGenre> GameGenres => Set<GameGenre>();

    public DbSet<UserGame> UserGames => Set<UserGame>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new UserRoleConfiguration());

        modelBuilder.Entity<GameGenre>(builder =>
        {
            builder.ToTable("GameGenres");

            builder.HasKey(gameGenre => new
            {
                gameGenre.GameId,
                gameGenre.GenreId
            });

            builder
                .HasOne(gameGenre => gameGenre.Game)
                .WithMany(game => game.GameGenres)
                .HasForeignKey(gameGenre => gameGenre.GameId);
            
            builder
                .HasOne(gameGenre => gameGenre.Genre)
                .WithMany(genre => genre.GameGenres)
                .HasForeignKey(gameGenre => gameGenre.GenreId);
        });

        modelBuilder.Entity<UserGame>(builder =>
        {
            builder.ToTable("UserGames");

            builder.HasKey(userGame => new
            {
                userGame.UserId,
                userGame.GameId
            });

            builder
                .HasOne(userGame => userGame.User)
                .WithMany(user => user.UserGames)
                .HasForeignKey(userGame => userGame.UserId);

            builder
                .HasOne(userGame => userGame.Game)
                .WithMany(game => game.UserGames)
                .HasForeignKey(userGame => userGame.GameId);
        });

        base.OnModelCreating(modelBuilder);
    }
}