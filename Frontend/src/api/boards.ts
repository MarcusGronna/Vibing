import { Board } from "../types/Board";
import { api } from "./client";

export async function getBoards(): Promise<Board[]> {
    return api<Board[]>("/boards");
}

export async function getBoard(id: number): Promise<Board> {
    return api<Board>(`/boards/${id}`);
}

export async function createBoard(data: Partial<Board>): Promise<Board> {
    return api<Board>("/boards", {
        method: "POST",
        body: data as any,
    });
}

export async function updateBoard(id: number, data: Partial<Board>): Promise<Board> {
    return api<Board>(`/boards/${id}`, {
        method: "PUT",
        body: data as any,
    });
}

export async function deleteBoard(id: number): Promise<void> {
    return api<void>(`/boards/${id}`, {
        method: "DELETE",
    });
}
