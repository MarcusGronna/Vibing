export interface TaskItem {
    id: number;
    title: string;
    description?: string;
    status: "Todo" | "InProgress" | "Done";
    boardId: number;
    priority: "Low" | "Medium" | "High";
    dueDate?: string; // ISO date string
}
