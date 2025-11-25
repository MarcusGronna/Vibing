namespace Backend.DTOs;

public record TaskDto(int Id, string Title, string? Description, string Status, int BoardId);
public record CreateTaskDto(string Title, string? Description, string Status, int BoardId);
public record UpdateTaskDto(string Title, string? Description, string Status, int BoardId);
