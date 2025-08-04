using OrderManagement.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace OrderManagement.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Client> Clients => Set<Client>();
    public DbSet<Product> Products => Set<Product>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var dateOnlyConverter = new ValueConverter<DateOnly, DateTime>(
            d => d.ToDateTime(TimeOnly.MinValue),
            d => DateOnly.FromDateTime(d));

        modelBuilder.Entity<Client>()
            .Property(e => e.BirthDate)
            .HasConversion(dateOnlyConverter);

        modelBuilder.Entity<Client>().HasQueryFilter(c => !c.IsDeleted);
        modelBuilder.Entity<Product>().HasQueryFilter(p => !p.IsDeleted);

        modelBuilder.Entity<Product>()
            .Property(p => p.Amount)
            .HasColumnType("decimal(18,2)");
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;

        foreach (var entry in ChangeTracker.Entries())
        {
            if (entry.State == EntityState.Added)
            {
                switch (entry.Entity)
                {
                    case Client client:
                        client.CreatedAt = now;
                        client.UpdatedAt = now;
                        break;
                    case Product product:
                        product.CreatedAt = now;
                        product.UpdatedAt = now;
                        break;
                }
            }
            else if (entry.State == EntityState.Modified)
            {
                switch (entry.Entity)
                {
                    case Client client:
                        client.UpdatedAt = now;
                        break;
                    case Product product:
                        product.UpdatedAt = now;
                        break;
                }
            }
            else if (entry.State == EntityState.Deleted)
            {
                switch (entry.Entity)
                {
                    case Client client:
                        client.IsDeleted = true;
                        client.UpdatedAt = now;
                        entry.State = EntityState.Modified;
                        break;
                    case Product product:
                        product.IsDeleted = true;
                        product.UpdatedAt = now;
                        entry.State = EntityState.Modified;
                        break;
                }
            }
        }

        return await base.SaveChangesAsync(cancellationToken);
    }
}