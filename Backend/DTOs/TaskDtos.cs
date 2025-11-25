using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs;

public record TaskDto(int Id, string Title, string? Description, string Status, int BoardId, string Priority, DateTime? DueDate);

public record CreateTaskDto(
    [Required(ErrorMessage = "Title is required")]
    [StringLength(500, MinimumLength = 1, ErrorMessage = "Title must be between 1 and 500 characters")]
    string Title,

    [StringLength(2000, ErrorMessage = "Description cannot exceed 2000 characters")]
    string? Description,

    [Required]
    [RegularExpression("^(Todo|InProgress|Done)$", ErrorMessage = "Status must be Todo, InProgress, or Done")]
    string Status,

    [Required]
    [Range(1, int.MaxValue, ErrorMessage = "BoardId must be a positive number")]
    int BoardId,

    [Required]
    [RegularExpression("^(Low|Medium|High)$", ErrorMessage = "Priority must be Low, Medium, or High")]
    string Priority,

    DateTime? DueDate
);

public record UpdateTaskDto(
    [Required(ErrorMessage = "Title is required")]
    [StringLength(500, MinimumLength = 1, ErrorMessage = "Title must be between 1 and 500 characters")]
    string Title,

    [StringLength(2000, ErrorMessage = "Description cannot exceed 2000 characters")]
    string? Description,

    [Required]
    [RegularExpression("^(Todo|InProgress|Done)$", ErrorMessage = "Status must be Todo, InProgress, or Done")]
    string Status,

    [Required]
    [Range(1, int.MaxValue, ErrorMessage = "BoardId must be a positive number")]
    int BoardId,

    [Required]
    [RegularExpression("^(Low|Medium|High)$", ErrorMessage = "Priority must be Low, Medium, or High")]
    string Priority,

    DateTime? DueDate
);
