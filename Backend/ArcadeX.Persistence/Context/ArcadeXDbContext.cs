using ArcadeX.Persistence.Entities;
using Microsoft.EntityFrameworkCore;
using ArcadeX.Persistence.Configurations;

namespace ArcadeX.Persistence.Context;

public class ArcadeXDbContext : DbContext
{
    public ArcadeXDbContext( DbContextOptions<ArcadeXDbContext> options ) : base(options){}
    public DbSet<User> Users => Set<User>();
    public DbSet<Role> Roles => Set<Role>();
    protected override void OnModelCreating( ModelBuilder modelBuilder )
    {
        modelBuilder.ApplyConfiguration( new UserRoleConfiguration());
        base.OnModelCreating(modelBuilder);
    }   
    public DbSet<UserRole> UserRoles => Set<UserRole>();
}