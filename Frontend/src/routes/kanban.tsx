import React from "react";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useTasks, useUpdateTask } from "../hooks/useTasks";
import { TaskColumn } from "../components/TaskColumn";
import { CreateTaskForm } from "../components/CreateTaskForm";

export default function KanbanRoute() {
    const { data, isLoading, isError, error, refetch } = useTasks();
    const { mutate: updateTask } = useUpdateTask();

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
                boardId: task.boardId,
            },
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-neutral-100 p-6">
                <h1 className="text-3xl font-bold text-neutral-900 mb-6">Kanban Board</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map(col => (
                        <div key={col} className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
                            <div className="h-6 bg-neutral-200 rounded animate-pulse mb-4"></div>
                            <div className="space-y-3">
                                <div className="h-20 bg-neutral-200 rounded animate-pulse"></div>
                                <div className="h-20 bg-neutral-200 rounded animate-pulse"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-neutral-100 p-6 flex flex-col items-center justify-center">
                <div className="text-red-600 text-center mb-4">Failed to load tasks: {(error as Error).message}</div>
                <button
                    onClick={() => refetch()}
                    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                    Try Again
                </button>
            </div>
        );
    }

    if (!data) return null;

    const tasks = data;
    const todo = tasks.filter(t => t.status === "Todo");
    const inProgress = tasks.filter(t => t.status === "InProgress");
    const done = tasks.filter(t => t.status === "Done");

    return (
        <div className="min-h-screen bg-neutral-100 p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-neutral-900">Kanban Board</h1>
                <button
                    onClick={() => refetch()}
                    className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm">
                    Refresh
                </button>
            </div>

            <CreateTaskForm />

            <DndContext onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <TaskColumn title="Todo" tasks={todo} statusId="Todo" />
                    <TaskColumn title="In Progress" tasks={inProgress} statusId="InProgress" />
                    <TaskColumn title="Done" tasks={done} statusId="Done" />
                </div>
            </DndContext>
        </div>
    );
}
