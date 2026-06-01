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
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<WishlistItem> Wishlist => Set<WishlistItem>();
    public DbSet<Achievement> Achievements => Set<Achievement>();
    public DbSet<UserAchievement> UserAchievements => Set<UserAchievement>();
    public DbSet<Offer> Offers => Set<Offer>();
    public DbSet<ReviewComment> ReviewComments => Set<ReviewComment>();
    public DbSet<Friend> Friends => Set<Friend>();
    public DbSet<GameSession> GameSessions => Set<GameSession>();


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


        modelBuilder.Entity<Review>(builder => {

            builder.ToTable("Reviews");
            builder.HasKey(review => review.Id);
            builder
                .HasOne(review => review.User)
                .WithMany(user => user.Reviews)
                .HasForeignKey(review => review.UserId);

            builder
                .HasOne(review => review.Game)
                .WithMany(game => game.Reviews)
                .HasForeignKey(review => review.GameId);

            builder
                .HasIndex(review => new
                {
                    review.UserId,
                    review.GameId
                }).IsUnique();
        });

        modelBuilder.Entity<WishlistItem>(builder =>
        {
            builder.ToTable("Wishlist");

            builder.HasKey(wishlistItem => new
            {
                wishlistItem.UserId,
                wishlistItem.GameId
            });

            builder
                .HasOne(wishlistItem => wishlistItem.User)
                .WithMany(user => user.WishlistItems)
                .HasForeignKey(wishlistItem => wishlistItem.UserId);

            builder
                .HasOne(wishlistItem => wishlistItem.Game)
                .WithMany(game => game.WishlistItems)
                .HasForeignKey(wishlistItem => wishlistItem.GameId);
        });

        modelBuilder.Entity<Achievement>(builder =>
        {
            builder.ToTable("Achievements");

            builder.HasKey(achievement => achievement.Id);

            builder
                .HasOne(achievement => achievement.Game)
                .WithMany(game => game.Achievements)
                .HasForeignKey(achievement => achievement.GameId);
        });

        modelBuilder.Entity<UserAchievement>(builder =>
        {
            builder.ToTable("UserAchievements");

            builder.HasKey(userAchievement => new
            {
                userAchievement.UserId,
                userAchievement.AchievementId
            });

            builder
                .HasOne(userAchievement => userAchievement.User)
                .WithMany(user => user.UserAchievements)
                .HasForeignKey(userAchievement => userAchievement.UserId);

            builder
                .HasOne(userAchievement => userAchievement.Achievement)
                .WithMany(achievement => achievement.UserAchievements)
                .HasForeignKey(userAchievement => userAchievement.AchievementId);
        });

        modelBuilder.Entity<Offer>(builder =>
        {
            builder.ToTable("Offers");

            builder.HasKey(offer => offer.OfferId);

            builder
                .HasOne(offer => offer.Game)
                .WithMany(game => game.Offers)
                .HasForeignKey(offer => offer.GameId);

            builder
                .Property(offer => offer.DiscountPct)
                .HasPrecision(5, 2);
                
            modelBuilder.Entity<Offer>(builder =>
            {
                builder.ToTable("Offers");

                builder.HasKey(offer => offer.OfferId);

                builder
                    .HasOne(offer => offer.Game)
                    .WithMany(game => game.Offers)
                    .HasForeignKey(offer => offer.GameId);

                builder
                    .Property(offer => offer.DiscountPct)
                    .HasPrecision(5, 2);
            });
        });
        modelBuilder.Entity<ReviewComment>(builder =>
        {
            builder.ToTable("ReviewComments");
            builder.HasKey(reviewComment => reviewComment.Id);
            builder
                .HasOne(reviewComment => reviewComment.Review)
                .WithMany(review => review.ReviewComments)
                .HasForeignKey(reviewComment => reviewComment.ReviewId);

            builder
                .HasOne(reviewComment => reviewComment.User)
                .WithMany(user => user.ReviewComments)
                .HasForeignKey(reviewComment => reviewComment.UserId);
        });

        modelBuilder.Entity<Friend>(builder =>
        {
            builder.ToTable("Friends");

            builder.HasKey(friend => new
            {
                friend.UserId,
                friend.FriendId
            });

            builder
                .HasOne(friend => friend.User)
                .WithMany(user => user.FriendsSent)
                .HasForeignKey(friend => friend.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder
                .HasOne(friend => friend.FriendUser)
                .WithMany(user => user.FriendsReceived)
                .HasForeignKey(friend => friend.FriendId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<GameSession>(builder =>
        {
            builder.ToTable("GameSessions");

            builder.HasKey(session => session.Id);

            builder
                .HasOne(session => session.User)
                .WithMany(user => user.GameSessions)
                .HasForeignKey(session => session.UserId);

            builder
                .HasOne(session => session.Game)
                .WithMany(game => game.GameSessions)
                .HasForeignKey(session => session.GameId);
        });

        modelBuilder.Entity<Game>(builder =>
        {
            builder.Property(game => game.Price).HasPrecision(10, 2);
        });

        base.OnModelCreating(modelBuilder);
    }
}