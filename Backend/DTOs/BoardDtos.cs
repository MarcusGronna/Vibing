using System.Collections.Generic;

namespace Backend.DTOs;

public record BoardDto(int Id, string Name, IEnumerable<TaskDto>? Tasks = null);
public record CreateBoardDto(string Name);
public record UpdateBoardDto(string Name);
