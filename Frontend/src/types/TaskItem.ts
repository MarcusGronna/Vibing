export interface TaskItem {
    id: number;
    title: string;
    description?: string;
    status: "Todo" | "InProgress" | "Done";
    boardId: number;
}
