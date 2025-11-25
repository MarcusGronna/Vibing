import React, { useState } from "react";
import { TaskItem } from "../types/TaskItem";
import { useUpdateTask, useDeleteTask } from "../hooks/useTasks";

interface TaskCardProps {
    task: TaskItem;
}

export function TaskCard({ task }: TaskCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(task.title);
    const [editDescription, setEditDescription] = useState(task.description || "");
    const [editStatus, setEditStatus] = useState<"Todo" | "InProgress" | "Done">(task.status);

    const { mutate: updateTask, isPending } = useUpdateTask();
    const { mutate: deleteTaskMutation, isPending: isDeleting } = useDeleteTask();

    const statusColors = {
        Todo: "bg-blue-100 text-blue-800",
        InProgress: "bg-yellow-100 text-yellow-800",
        Done: "bg-green-100 text-green-800",
    };

    const handleSave = () => {
        if (!editTitle.trim()) return;

        updateTask(
            {
                id: task.id,
                data: {
                    title: editTitle.trim(),
                    description: editDescription.trim() || undefined,
                    status: editStatus,
                    boardId: task.boardId,
                },
            },
            {
                onSuccess: () => {
                    setIsEditing(false);
                },
            }
        );
    };

    const handleCancel = () => {
        setEditTitle(task.title);
        setEditDescription(task.description || "");
        setEditStatus(task.status);
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Escape") {
            handleCancel();
        }
    };

    const handleDelete = () => {
        if (!confirm("Are you sure you want to delete this task?")) return;
        deleteTaskMutation(task.id);
    };

    if (isEditing) {
        return (
            <div
                className={`bg-white rounded-lg shadow-md p-4 border-2 ${
                    isPending ? "border-yellow-400" : "border-blue-500"
                } transition-all`}
                onKeyDown={handleKeyDown}>
                <div className="space-y-3">
                    <input
                        type="text"
                        value={editTitle}
                        onChange={e => setEditTitle(e.target.value)}
                        className="w-full px-2 py-1 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Task title"
                        disabled={isPending}
                        autoFocus
                    />

                    <textarea
                        value={editDescription}
                        onChange={e => setEditDescription(e.target.value)}
                        className="w-full px-2 py-1 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="Description (optional)"
                        rows={3}
                        disabled={isPending}
                    />

                    <select
                        value={editStatus}
                        onChange={e => setEditStatus(e.target.value as "Todo" | "InProgress" | "Done")}
                        className="w-full px-2 py-1 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        disabled={isPending}>
                        <option value="Todo">Todo</option>
                        <option value="InProgress">In Progress</option>
                        <option value="Done">Done</option>
                    </select>

                    <div className="flex gap-2">
                        <button
                            onClick={handleSave}
                            disabled={isPending || !editTitle.trim()}
                            className="flex-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:bg-neutral-400 disabled:cursor-not-allowed transition-colors">
                            {isPending ? "Saving..." : "Save"}
                        </button>
                        <button
                            onClick={handleCancel}
                            disabled={isPending}
                            className="flex-1 px-3 py-1 bg-neutral-200 text-neutral-700 rounded text-sm hover:bg-neutral-300 disabled:cursor-not-allowed transition-colors">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all p-4 border border-neutral-200">
            <h3 className="font-semibold text-neutral-900 mb-2">{task.title}</h3>
            {task.description && <p className="text-sm text-neutral-600 mb-3 line-clamp-3">{task.description}</p>}
            <div className="flex items-center justify-between">
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${statusColors[task.status]}`}>
                    {task.status}
                </span>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsEditing(true)}
                        disabled={isDeleting}
                        className="px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        Edit
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="px-2 py-1 text-xs text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}
