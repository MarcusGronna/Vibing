export type TaskStatus = "Todo" | "InProgress" | "Done";

export function getStatusLabel(status: TaskStatus): string {
    const labels: Record<TaskStatus, string> = {
        Todo: "To Do",
        InProgress: "In Progress",
        Done: "Done",
    };
    return labels[status];
}

export function getNextStatus(currentStatus: TaskStatus): TaskStatus {
    const progression: Record<TaskStatus, TaskStatus> = {
        Todo: "InProgress",
        InProgress: "Done",
        Done: "Done",
    };
    return progression[currentStatus];
}
