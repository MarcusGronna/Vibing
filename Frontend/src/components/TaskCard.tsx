import React from "react";
import { TaskItem } from "../types/TaskItem";

interface TaskCardProps {
    task: TaskItem;
}

export function TaskCard({ task }: TaskCardProps) {
    const statusColors = {
        Todo: "bg-blue-100 text-blue-800",
        InProgress: "bg-yellow-100 text-yellow-800",
        Done: "bg-green-100 text-green-800",
    };

    return (
        <div className="bg-white rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all p-4 border border-neutral-200">
            <h3 className="font-semibold text-neutral-900 mb-2">{task.title}</h3>
            {task.description && <p className="text-sm text-neutral-600 mb-3">{task.description}</p>}
            <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${statusColors[task.status]}`}>
                {task.status}
            </span>
        </div>
    );
}
