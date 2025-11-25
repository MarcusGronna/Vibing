using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs;

public record BoardDto(int Id, string Name, IEnumerable<TaskDto>? Tasks = null);

public record CreateBoardDto(
    [Required(ErrorMessage = "Name is required")]
    [StringLength(200, MinimumLength = 1, ErrorMessage = "Name must be between 1 and 200 characters")]
    string Name
);

public record UpdateBoardDto(
    [Required(ErrorMessage = "Name is required")]
    [StringLength(200, MinimumLength = 1, ErrorMessage = "Name must be between 1 and 200 characters")]
    string Name
);
