using Backend.DTOs;
using Backend.Entities;
using Backend.Repositories;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Endpoints;

public static class BoardsEndpoints
{
    public static void MapBoardsEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/boards");

        group.MapGet("/", async (IBoardRepository repo) =>
        {
            var boards = (await repo.GetAllBoardsAsync())
                .Select(b => new BoardDto(
                    b.Id,
                    b.Name,
                    b.Tasks?.Select(t => new TaskDto(
                        t.Id,
                        t.Title,
                        t.Description,
                        t.Status,
                        t.BoardId,
                        t.Priority,
                        t.DueDate
                    )) ?? Enumerable.Empty<TaskDto>()
                ));
            return Results.Ok(boards);
        });

        group.MapGet("/{id:int}", async (int id, IBoardRepository repo) =>
        {
            var board = await repo.GetBoardByIdAsync(id);
            if (board == null) return Results.NotFound();
            var dto = new BoardDto(
                board.Id,
                board.Name,
                board.Tasks?.Select(t => new TaskDto(
                    t.Id,
                    t.Title,
                    t.Description,
                    t.Status,
                    t.BoardId,
                    t.Priority,
                    t.DueDate
                )) ?? Enumerable.Empty<TaskDto>()
            );
            return Results.Ok(dto);
        });

        group.MapPost("/", async (CreateBoardDto input, IBoardRepository repo) =>
        {
            var board = new Board { Name = input.Name };
            var created = await repo.CreateBoardAsync(board);
            var dto = new BoardDto(created.Id, created.Name, null);
            return Results.Created($"/boards/{dto.Id}", dto);
        });

        group.MapPut("/{id:int}", async (int id, UpdateBoardDto input, IBoardRepository repo) =>
        {
            var existing = await repo.GetBoardByIdAsync(id);
            if (existing == null) return Results.NotFound();
            existing.Name = input.Name;
            var updated = await repo.UpdateBoardAsync(existing);
            return updated ? Results.NoContent() : Results.NotFound();
        });

        group.MapDelete("/{id:int}", async (int id, IBoardRepository repo) =>
        {
            var deleted = await repo.DeleteBoardAsync(id);
            return deleted ? Results.NoContent() : Results.NotFound();
        });
    }
}
