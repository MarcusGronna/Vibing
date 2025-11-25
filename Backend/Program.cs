using Backend.Data;
using Backend.Repositories;
using Backend.Endpoints;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

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

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors(viteCors);

// Add validation middleware
app.Use(async (context, next) =>
{
    await next();

    if (context.Response.StatusCode == 400)
    {
        context.Response.ContentType = "application/json";
    }
});

// Map endpoints
app.MapBoardsEndpoints();
app.MapTasksEndpoints();

// ensure database is created at startup (use migrations in development)
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<KanbanDbContext>();
    db.Database.Migrate();
}

app.Run();
