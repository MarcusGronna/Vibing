using Backend.Data;
using Backend.Repositories;
using Backend.Endpoints;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Configure JSON serialization to use camelCase
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    options.SerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
});

// add connection string in appsettings.json (see changes below)
var connection = builder.Configuration.GetConnectionString("KanbanConnection") ?? "Data Source=kanban.db";
builder.Services.AddDbContext<KanbanDbContext>(options => options.UseSqlite(connection));

// repositories
builder.Services.AddScoped<IBoardRepository, BoardRepository>();
builder.Services.AddScoped<ITaskRepository, TaskRepository>();

// Fix CORS - must be configured before building app
builder.Services.AddCors(options =>
{
    options.AddPolicy("ViteCors", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
        policy.WithOrigins("http://localhost:5173/kanban")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

var app = builder.Build();

// CORS must be used BEFORE routing
app.UseCors("ViteCors");

app.MapBoardsEndpoints();
app.MapTasksEndpoints();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<KanbanDbContext>();
    db.Database.EnsureCreated();

    if (!db.Boards.Any())
    {
        var board = new Board { Name = "My Kanban Board" };
        db.Boards.Add(board);
        db.SaveChanges();
    }
}

app.Run();
