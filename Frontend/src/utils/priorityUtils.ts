import { TaskPriority } from "../features/tasks/types/TaskItem";

export function getPriorityWeight(priority: TaskPriority): number {
    const weights: Record<TaskPriority, number> = {
        Low: 1,
        Medium: 2,
        High: 3,
    };
    return weights[priority];
}

export function sortByPriority<T extends { priority: TaskPriority }>(tasks: T[]): T[] {
    return [...tasks].sort((a, b) => getPriorityWeight(b.priority) - getPriorityWeight(a.priority));
}
