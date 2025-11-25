using Backend.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Repositories;

public interface ITaskRepository
{
    Task<IEnumerable<TaskItem>> GetAllTasksAsync();
    Task<TaskItem?> GetTaskByIdAsync(int id);
    Task<TaskItem> CreateTaskAsync(TaskItem item);
    Task<bool> UpdateTaskAsync(TaskItem item);
    Task<bool> DeleteTaskAsync(int id);
}
