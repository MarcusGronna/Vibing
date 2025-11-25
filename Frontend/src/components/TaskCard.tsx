import React, { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { TaskItem } from "../types/TaskItem";
import { useUpdateTask, useDeleteTask } from "../hooks/useTasks";
import { isOverdue, formatDate } from "../utils/date";

interface TaskCardProps {
    task: TaskItem;
}

export function TaskCard({ task }: TaskCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(task.title);
    const [editDescription, setEditDescription] = useState(task.description || "");
    const [editStatus, setEditStatus] = useState<"Todo" | "InProgress" | "Done">(task.status);
    const [editPriority, setEditPriority] = useState<"Low" | "Medium" | "High">(task.priority);
    const [editDueDate, setEditDueDate] = useState(task.dueDate || "");

    const { mutate: updateTask, isPending } = useUpdateTask();
    const { mutate: deleteTaskMutation, isPending: isDeleting } = useDeleteTask();

    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: task.id,
        disabled: isEditing || isPending || isDeleting,
    });

    const style = transform
        ? {
              transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
          }
        : undefined;

    const priorityColors = {
        Low: "bg-green-100 text-green-800",
        Medium: "bg-yellow-100 text-yellow-800",
        High: "bg-red-100 text-red-800",
    };

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
                    priority: editPriority,
                    dueDate: editDueDate || undefined,
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
        setEditPriority(task.priority);
        setEditDueDate(task.dueDate || "");
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

                    <select
                        value={editPriority}
                        onChange={e => setEditPriority(e.target.value as "Low" | "Medium" | "High")}
                        className="w-full px-2 py-1 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        disabled={isPending}>
                        <option value="Low">Low Priority</option>
                        <option value="Medium">Medium Priority</option>
                        <option value="High">High Priority</option>
                    </select>

                    <input
                        type="date"
                        value={editDueDate}
                        onChange={e => setEditDueDate(e.target.value)}
                        className="w-full px-2 py-1 border border-neutral-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        disabled={isPending}
                    />

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
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-all p-4 border border-neutral-200 ${
                isDragging ? "opacity-50 shadow-lg scale-105 cursor-grabbing" : "cursor-grab"
            }`}>
            <h3 className="font-semibold text-neutral-900 mb-2">{task.title}</h3>
            {task.description && <p className="text-sm text-neutral-600 mb-3 line-clamp-3">{task.description}</p>}

            <div className="flex flex-wrap gap-2 mb-3">
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${statusColors[task.status]}`}>
                    {task.status}
                </span>
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${priorityColors[task.priority]}`}>
                    {task.priority}
                </span>
            </div>

            {task.dueDate && (
                <p
                    className={`text-xs mb-2 ${
                        isOverdue(task.dueDate) ? "text-red-600 font-semibold" : "text-neutral-600"
                    }`}>
                    Due: {formatDate(task.dueDate)}
                    {isOverdue(task.dueDate) && " (Overdue)"}
                </p>
            )}

            <div className="flex items-center justify-end gap-2">
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
    );
}
