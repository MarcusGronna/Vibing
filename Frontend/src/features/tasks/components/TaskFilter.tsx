import React from "react";
import { TaskPriority } from "../types/TaskItem";

export interface TaskFilterProps {
    priorityFilter: TaskPriority | "All";
    dueDateFilter: "All" | "Today" | "This Week" | "Overdue";
    onPriorityChange: (priority: TaskPriority | "All") => void;
    onDueDateChange: (filter: "All" | "Today" | "This Week" | "Overdue") => void;
}

export function TaskFilter({ priorityFilter, dueDateFilter, onPriorityChange, onDueDateChange }: TaskFilterProps) {
    const handleClearFilters = () => {
        onPriorityChange("All");
        onDueDateChange("All");
    };

    const hasActiveFilters = priorityFilter !== "All" || dueDateFilter !== "All";

    return (
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <h2 className="text-lg font-bold text-neutral-900">Filters</h2>
                {hasActiveFilters && (
                    <button
                        onClick={handleClearFilters}
                        className="px-3 py-1.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100 rounded-md">
                        Clear Filters
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                    <label htmlFor="priority-filter" className="block text-sm font-medium text-neutral-700 mb-2">
                        Priority
                    </label>
                    <select
                        id="priority-filter"
                        value={priorityFilter}
                        onChange={e => onPriorityChange(e.target.value as TaskPriority | "All")}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="All">All Priorities</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="duedate-filter" className="block text-sm font-medium text-neutral-700 mb-2">
                        Due Date
                    </label>
                    <select
                        id="duedate-filter"
                        value={dueDateFilter}
                        onChange={e => onDueDateChange(e.target.value as "All" | "Today" | "This Week" | "Overdue")}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="All">All Dates</option>
                        <option value="Today">Due Today</option>
                        <option value="This Week">Due This Week</option>
                        <option value="Overdue">Overdue</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
