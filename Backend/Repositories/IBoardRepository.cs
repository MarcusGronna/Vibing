using Backend.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Repositories;

public interface IBoardRepository
{
    Task<IEnumerable<Board>> GetAllBoardsAsync();
    Task<Board?> GetBoardByIdAsync(int id);
    Task<Board> CreateBoardAsync(Board board);
    Task<bool> UpdateBoardAsync(Board board);
    Task<bool> DeleteBoardAsync(int id);
}
