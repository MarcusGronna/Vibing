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
        <section
            ref={setNodeRef}
            role="region"
            aria-labelledby={`column-${statusId}`}
            className={`bg-neutral-50 border-2 rounded-lg p-4 transition-all duration-200 min-h-[400px] ${
                isOver ? "border-blue-500 bg-blue-50 shadow-md" : "border-neutral-200 shadow-sm"
            }`}>
            <h2
                id={`column-${statusId}`}
                className="text-lg font-bold text-neutral-800 mb-4 pb-2 border-b-2 border-neutral-200">
                {title}
                <span className="ml-2 text-sm font-normal text-neutral-500">({tasks.length})</span>
            </h2>
            <div className="space-y-3">
                {tasks.length === 0 ? (
                    <p className="text-sm text-neutral-500 italic text-center py-8">No tasks</p>
                ) : (
                    tasks.map(task => <TaskCard key={task.id} task={task} />)
                )}
            </div>
        </section>
    );
}
