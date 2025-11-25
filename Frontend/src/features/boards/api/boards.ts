import { apiClient } from "../../../app/client";
import { Board } from "../types";

export async function getBoards(): Promise<Board[]> {
  return apiClient<Board[]>("/boards");
}

export async function getBoard(id: number): Promise<Board> {
  return apiClient<Board>(`/boards/${id}`);
}

export async function createBoard(data: Partial<Board>): Promise<Board> {
  return apiClient<Board>("/boards", {
    method: "POST",
    body: data as any,
  });
}

export async function updateBoard(id: number, data: Partial<Board>): Promise<Board> {
  return apiClient<Board>(`/boards/${id}`, {
    method: "PUT",
    body: data as any,
  });
}

export async function deleteBoard(id: number): Promise<void> {
  return apiClient<void>(`/boards/${id}`, {
    method: "DELETE",
  });
}
