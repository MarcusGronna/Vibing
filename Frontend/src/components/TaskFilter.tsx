import React from "react";

interface TaskFilterProps {
    priorityFilter: "All" | "Low" | "Medium" | "High";
    dueDateFilter: "All" | "Today" | "This Week" | "Overdue";
    onPriorityChange: (priority: "All" | "Low" | "Medium" | "High") => void;
    onDueDateChange: (filter: "All" | "Today" | "This Week" | "Overdue") => void;
}

export function TaskFilter({ priorityFilter, dueDateFilter, onPriorityChange, onDueDateChange }: TaskFilterProps) {
    return (
        <div className="bg-white rounded-lg shadow p-4 mb-6">
            <h2 className="text-lg font-bold text-neutral-900 mb-4">Filters</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="priority-filter" className="block text-sm font-medium text-neutral-700 mb-2">
                        Priority
                    </label>
                    <select
                        id="priority-filter"
                        value={priorityFilter}
                        onChange={e => onPriorityChange(e.target.value as "All" | "Low" | "Medium" | "High")}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
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
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
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
