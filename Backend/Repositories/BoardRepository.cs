using Backend.Data;
using Backend.Entities;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Repositories;

public class BoardRepository : IBoardRepository
{
    private readonly KanbanDbContext _db;

    public BoardRepository(KanbanDbContext db) => _db = db;

    public async Task<IEnumerable<Board>> GetAllBoardsAsync()
    {
        return await _db.Boards.Include(b => b.Tasks).AsNoTracking().ToListAsync();
    }

    public async Task<Board?> GetBoardByIdAsync(int id)
    {
        return await _db.Boards.Include(b => b.Tasks).FirstOrDefaultAsync(b => b.Id == id);
    }

    public async Task<Board> CreateBoardAsync(Board board)
    {
        _db.Boards.Add(board);
        await _db.SaveChangesAsync();
        return board;
    }

    public async Task<bool> UpdateBoardAsync(Board board)
    {
        var exists = await _db.Boards.AnyAsync(b => b.Id == board.Id);
        if (!exists) return false;
        _db.Entry(board).State = EntityState.Modified;
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteBoardAsync(int id)
    {
        var entity = await _db.Boards.FindAsync(id);
        if (entity == null) return false;
        _db.Boards.Remove(entity);
        await _db.SaveChangesAsync();
        return true;
    }
}
