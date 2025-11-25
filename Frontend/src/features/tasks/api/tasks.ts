import { apiClient } from "../../../app/client";
import { TaskItem } from "../types";

export async function getTasks(): Promise<TaskItem[]> {
    return apiClient<TaskItem[]>("/tasks");
}

export async function getTask(id: number): Promise<TaskItem> {
    return apiClient<TaskItem>(`/tasks/${id}`);
}

export async function createTask(data: Partial<TaskItem>): Promise<TaskItem> {
    return apiClient<TaskItem>("/tasks", {
        method: "POST",
        body: data as any,
    });
}

export async function updateTask(id: number, data: Partial<TaskItem>): Promise<TaskItem> {
    return apiClient<TaskItem>(`/tasks/${id}`, {
        method: "PUT",
        body: data as any,
    });
}

export async function deleteTask(id: number): Promise<void> {
    return apiClient<void>(`/tasks/${id}`, {
        method: "DELETE",
    });
}
