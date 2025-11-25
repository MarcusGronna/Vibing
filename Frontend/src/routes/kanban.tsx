import React, { useState } from "react";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useTasks, useUpdateTask } from "../features/tasks/hooks";
import { TaskColumn } from "../features/tasks/components/TaskColumn";
import { CreateTaskForm } from "../features/tasks/components/CreateTaskForm";
import { TaskFilter } from "../features/tasks/components/TaskFilter";
import { isToday, isThisWeek, isOverdue } from "../utils/dateUtils";

export default function KanbanRoute() {
    const { data, isLoading, isError, error, refetch } = useTasks();
    const { mutate: updateTask } = useUpdateTask();

    const [priorityFilter, setPriorityFilter] = useState<"All" | "Low" | "Medium" | "High">("All");
    const [dueDateFilter, setDueDateFilter] = useState<"All" | "Today" | "This Week" | "Overdue">("All");
    const [searchQuery, setSearchQuery] = useState("");

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;

        const taskId = Number(active.id);
        const newStatus = over.id as "Todo" | "InProgress" | "Done";

        // Find the task to get its current data
        const task = data?.find(t => t.id === taskId);
        if (!task || task.status === newStatus) return;

        updateTask({
            id: taskId,
            data: {
                title: task.title,
                description: task.description,
                status: newStatus,
                priority: task.priority,
                dueDate: task.dueDate,
                boardId: task.boardId,
            },
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-neutral-100 p-4 sm:p-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-6">Kanban Board</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {[1, 2, 3].map(col => (
                            <div
                                key={col}
                                className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 min-h-[400px]">
                                <div className="h-6 bg-neutral-200 rounded animate-pulse mb-4"></div>
                                <div className="space-y-3">
                                    <div className="h-24 bg-neutral-200 rounded animate-pulse"></div>
                                    <div className="h-24 bg-neutral-200 rounded animate-pulse"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-neutral-100 p-4 sm:p-6 flex flex-col items-center justify-center">
                <div className="text-center max-w-md">
                    <p className="text-red-600 text-lg mb-4" role="alert">
                        Failed to load tasks: {(error as Error).message}
                    </p>
                    <button
                        onClick={() => refetch()}
                        className="px-6 py-3 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 active:scale-[0.97]"
                        aria-label="Retry loading tasks">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!data) return null;

    // Apply filters
    let filteredTasks = data;

    // Search filter
    if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filteredTasks = filteredTasks.filter(
            t => t.title.toLowerCase().includes(query) || t.description?.toLowerCase().includes(query)
        );
    }

    // Priority filter
    if (priorityFilter !== "All") {
        filteredTasks = filteredTasks.filter(t => t.priority === priorityFilter);
    }

    // Due date filter
    if (dueDateFilter === "Today") {
        filteredTasks = filteredTasks.filter(t => isToday(t.dueDate));
    } else if (dueDateFilter === "This Week") {
        filteredTasks = filteredTasks.filter(t => isThisWeek(t.dueDate));
    } else if (dueDateFilter === "Overdue") {
        filteredTasks = filteredTasks.filter(t => isOverdue(t.dueDate));
    }

    const todo = filteredTasks.filter(t => t.status === "Todo");
    const inProgress = filteredTasks.filter(t => t.status === "InProgress");
    const done = filteredTasks.filter(t => t.status === "Done");

    return (
        <div className="min-h-screen bg-neutral-100 p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">
                <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">Kanban Board</h1>
                    <button
                        onClick={() => refetch()}
                        className="px-4 py-2 rounded-md bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 active:scale-[0.97]"
                        aria-label="Refresh tasks">
                        Refresh
                    </button>
                </header>

                <CreateTaskForm />

                <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4 mb-6">
                    <label htmlFor="search" className="block text-sm font-medium text-neutral-700 mb-2">
                        Search Tasks
                    </label>
                    <input
                        id="search"
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search by title or description..."
                        className="w-full px-4 py-2 border border-neutral-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                </div>

                <TaskFilter
                    priorityFilter={priorityFilter}
                    dueDateFilter={dueDateFilter}
                    onPriorityChange={setPriorityFilter}
                    onDueDateChange={setDueDateFilter}
                />

                <DndContext onDragEnd={handleDragEnd}>
                    <div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                        role="main"
                        aria-label="Kanban board columns">
                        <TaskColumn title="Todo" tasks={todo} statusId="Todo" />
                        <TaskColumn title="In Progress" tasks={inProgress} statusId="InProgress" />
                        <TaskColumn title="Done" tasks={done} statusId="Done" />
                    </div>
                </DndContext>
            </div>
        </div>
    );
}
