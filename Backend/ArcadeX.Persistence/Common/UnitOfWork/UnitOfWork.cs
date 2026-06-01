using ArcadeX.Application.Common.Interfaces;
using ArcadeX.Persistence.Context;
using Microsoft.EntityFrameworkCore.Storage;

namespace ArcadeX.Persistence.Common.UnitOfWork;

public class UnitOfWork : IUnitOfWork
{
    private readonly ArcadeXDbContext _context;
    private IDbContextTransaction? _transaction;

    public UnitOfWork(ArcadeXDbContext context)
    {
        _context = context;
    }

    public async Task BeginTransactionAsync()
    {
        _transaction = await _context.Database.BeginTransactionAsync();
    }

    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }

    public async Task CommitAsync()
    {
        if (_transaction is null)
        {
            return;
        }

        await _transaction.CommitAsync();
        await _transaction.DisposeAsync();

        _transaction = null;
    }

    public async Task RollbackAsync()
    {
        if (_transaction is null)
        {
            return;
        }

        await _transaction.RollbackAsync();
        await _transaction.DisposeAsync();

        _transaction = null;
    }
}