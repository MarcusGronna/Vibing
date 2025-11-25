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

// CORS policy for Vite dev server
const string viteCors = "ViteCors";
builder.Services.AddCors(options =>
{
    options.AddPolicy(viteCors, policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .WithMethods("GET", "POST", "PUT", "DELETE", "PATCH")
              .AllowCredentials();
    });
});

// Add model validation
builder.Services.AddControllers(); // Needed for validation

var app = builder.Build();

app.UseHttpsRedirection();
app.UseCors(viteCors);

// Map endpoints
app.MapBoardsEndpoints();
app.MapTasksEndpoints();

// Ensure database is created and migrated
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<KanbanDbContext>();
    db.Database.EnsureCreated();

    // Seed initial data if empty
    if (!db.Boards.Any())}
{
    var board = new Board { Name = "My Board" }; 6");
        db.Boards.Add(board); db.SaveChanges(); db.Tasks.Add(new TaskItem
        {
            Title = "Welcome Task",
            Description = "This is your first task!",
            Status = "Todo",
            Priority = "Medium",
            BoardId = board.Id
        });
    db.SaveChanges();
}
}

app.Run("http://localhost:5146");
