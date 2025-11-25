export type TaskStatus = "Todo" | "InProgress" | "Done";
export type TaskPriority = "Low" | "Medium" | "High";

export interface TaskItem {
    id: number;
    title: string;
    description?: string;
    status: TaskStatus;
    boardId: number;
    priority: TaskPriority;
    dueDate?: string;
}
