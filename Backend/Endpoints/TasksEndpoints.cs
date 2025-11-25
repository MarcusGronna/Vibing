using Backend.DTOs;
using Backend.Entities;
using Backend.Repositories;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Endpoints;

public static class TasksEndpoints
{
    public static void MapTasksEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/tasks");

        group.MapGet("/", async (ITaskRepository repo) =>
        {
            var tasks = (await repo.GetAllTasksAsync())
                .Select(t => new TaskDto(t.Id, t.Title, t.Description, t.Status, t.BoardId, t.Priority, t.DueDate));
            return Results.Ok(tasks);
        });

        group.MapGet("/{id:int}", async (int id, ITaskRepository repo) =>
        {
            var t = await repo.GetTaskByIdAsync(id);
            if (t == null) return Results.NotFound();
            var dto = new TaskDto(t.Id, t.Title, t.Description, t.Status, t.BoardId, t.Priority, t.DueDate);
            return Results.Ok(dto);
        });

        group.MapPost("/", async (CreateTaskDto input, ITaskRepository repo) =>
        {
            var item = new TaskItem
            {
                Title = input.Title,
                Description = input.Description,
                Status = input.Status,
                BoardId = input.BoardId,
                Priority = input.Priority,
                DueDate = input.DueDate
            };
            var created = await repo.CreateTaskAsync(item);
            var dto = new TaskDto(created.Id, created.Title, created.Description, created.Status, created.BoardId, created.Priority, created.DueDate);
            return Results.Created($"/tasks/{dto.Id}", dto);
        });

        group.MapPut("/{id:int}", async (int id, UpdateTaskDto input, ITaskRepository repo) =>
        {
            var existing = await repo.GetTaskByIdAsync(id);
            if (existing == null) return Results.NotFound();
            existing.Title = input.Title;
            existing.Description = input.Description;
            existing.Status = input.Status;
            existing.BoardId = input.BoardId;
            existing.Priority = input.Priority;
            existing.DueDate = input.DueDate;
            var updated = await repo.UpdateTaskAsync(existing);
            return updated ? Results.NoContent() : Results.NotFound();
        });

        group.MapDelete("/{id:int}", async (int id, ITaskRepository repo) =>
        {
            var deleted = await repo.DeleteTaskAsync(id);
            return deleted ? Results.NoContent() : Results.NotFound();
        });
    }
}
