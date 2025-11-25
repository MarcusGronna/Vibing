import React from "react";

interface TaskFilterProps {
    priorityFilter: "All" | "Low" | "Medium" | "High";
    dueDateFilter: "All" | "Today" | "This Week" | "Overdue";
    onPriorityChange: (priority: "All" | "Low" | "Medium" | "High") => void;
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
                        className="px-3 py-1.5 text-sm font-medium text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 active:scale-[0.97]"
                        aria-label="Clear all filters">
                        Clear Filters
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <fieldset className="space-y-2">
                    <legend className="sr-only">Filter by priority</legend>
                    <label htmlFor="priority-filter" className="block text-sm font-medium text-neutral-700">
                        Priority
                    </label>
                    <select
                        id="priority-filter"
                        value={priorityFilter}
                        onChange={e => onPriorityChange(e.target.value as "All" | "Low" | "Medium" | "High")}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        aria-label="Filter tasks by priority">
                        <option value="All">All Priorities</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </fieldset>

                <fieldset className="space-y-2">
                    <legend className="sr-only">Filter by due date</legend>
                    <label htmlFor="duedate-filter" className="block text-sm font-medium text-neutral-700">
                        Due Date
                    </label>
                    <select
                        id="duedate-filter"
                        value={dueDateFilter}
                        onChange={e => onDueDateChange(e.target.value as "All" | "Today" | "This Week" | "Overdue")}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        aria-label="Filter tasks by due date">
                        <option value="All">All Dates</option>
                        <option value="Today">Due Today</option>
                        <option value="This Week">Due This Week</option>
                        <option value="Overdue">Overdue</option>
                    </select>
                </fieldset>
            </div>
        </div>
    );
}
