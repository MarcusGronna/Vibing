import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { TaskItem } from "../types/TaskItem";
import { TaskCard } from "./TaskCard";

interface TaskColumnProps {
    title: string;
    tasks: TaskItem[];
    statusId: "Todo" | "InProgress" | "Done";
}

export function TaskColumn({ title, tasks, statusId }: TaskColumnProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: statusId,
    });

    return (
        <div
            ref={setNodeRef}
            className={`bg-neutral-50 border-2 rounded-lg p-4 transition-colors ${
                isOver ? "border-blue-500 bg-blue-50" : "border-neutral-200"
            }`}>
            <h2 className="text-lg font-bold text-neutral-800 mb-4">{title}</h2>
            <div className="space-y-3">
                {tasks.length === 0 ? (
                    <p className="text-sm text-neutral-500 italic">No tasks</p>
                ) : (
                    tasks.map(task => <TaskCard key={task.id} task={task} />)
                )}
            </div>
        </div>
    );
}
