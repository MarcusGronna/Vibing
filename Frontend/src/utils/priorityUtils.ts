export type Priority = "Low" | "Medium" | "High";

export function getPriorityWeight(priority: Priority): number {
    const weights: Record<Priority, number> = {
        Low: 1,
        Medium: 2,
        High: 3,
    };
    return weights[priority];
}

export function sortByPriority<T extends { priority: Priority }>(tasks: T[]): T[] {
    return [...tasks].sort((a, b) => getPriorityWeight(b.priority) - getPriorityWeight(a.priority));
}
