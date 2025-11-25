using Backend.Data;
using Backend.Entities;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Repositories;

public class TaskRepository : ITaskRepository
{
    private readonly KanbanDbContext _db;

    public TaskRepository(KanbanDbContext db) => _db = db;

    public async Task<IEnumerable<TaskItem>> GetAllTasksAsync()
    {
        return await _db.Tasks.Include(t => t.Board).AsNoTracking().ToListAsync();
    }

    public async Task<TaskItem?> GetTaskByIdAsync(int id)
    {
        return await _db.Tasks.Include(t => t.Board).FirstOrDefaultAsync(t => t.Id == id);
    }

    public async Task<TaskItem> CreateTaskAsync(TaskItem item)
    {
        _db.Tasks.Add(item);
        await _db.SaveChangesAsync();
        return item;
    }

    public async Task<bool> UpdateTaskAsync(TaskItem item)
    {
        var exists = await _db.Tasks.AnyAsync(t => t.Id == item.Id);
        if (!exists) return false;
        _db.Entry(item).State = EntityState.Modified;
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteTaskAsync(int id)
    {
        var entity = await _db.Tasks.FindAsync(id);
        if (entity == null) return false;
        _db.Tasks.Remove(entity);
        await _db.SaveChangesAsync();
        return true;
    }
}
