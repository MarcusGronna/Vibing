import { TaskItem } from "../types/TaskItem";
import { api } from "./client";

export async function getTasks(): Promise<TaskItem[]> {
    return api<TaskItem[]>("/tasks");
}

export async function getTask(id: number): Promise<TaskItem> {
    return api<TaskItem>(`/tasks/${id}`);
}

export async function createTask(data: Partial<TaskItem>): Promise<TaskItem> {
    return api<TaskItem>("/tasks", {
        method: "POST",
        body: data as any,
    });
}

export async function updateTask(id: number, data: Partial<TaskItem>): Promise<TaskItem> {
    return api<TaskItem>(`/tasks/${id}`, {
        method: "PUT",
        body: data as any,
    });
}

export async function deleteTask(id: number): Promise<void> {
    return api<void>(`/tasks/${id}`, {
        method: "DELETE",
    });
}
