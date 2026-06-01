namespace ArcadeX.Application.Common.Interfaces;

public interface IUnitOfWork
{

    Task BeginTransactionAsync();
    Task<int> SaveChangesAsync();
    Task CommitAsync();
    Task RollbackAsync();
    
}