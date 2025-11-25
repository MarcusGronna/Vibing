import React, { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { TaskItem, TaskStatus, TaskPriority } from "../types/TaskItem";
import { useUpdateTask } from "../hooks/useUpdateTask";
import { useDeleteTask } from "../hooks/useDeleteTask";
import { isOverdue, formatDate } from "../../../utils/dateUtils";
import { PRIORITY_COLORS, STATUS_COLORS } from "../../../app/constants";

interface TaskCardProps {
    task: TaskItem;
}

export function TaskCard({ task }: TaskCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [editTitle, setEditTitle] = useState(task.title);
    const [editDescription, setEditDescription] = useState(task.description || "");
    const [editStatus, setEditStatus] = useState<TaskStatus>(task.status);
    const [editPriority, setEditPriority] = useState<TaskPriority>(task.priority);
    const [editDueDate, setEditDueDate] = useState(task.dueDate || "");

    const { mutate: updateTask, isPending } = useUpdateTask();
    const { mutate: deleteTaskMutation, isPending: isDeleting } = useDeleteTask();

    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: task.id,
        disabled: isEditing || isPending || isDeleting,
    });

    const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;

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
            { onSuccess: () => setIsEditing(false) }
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
        if (e.key === "Escape") handleCancel();
    };

    if (isEditing) {
        return (
            <article
                role="article"
                aria-labelledby={`task-title-edit-${task.id}`}
                className={`bg-white rounded-lg shadow-md p-4 border-2 ${
                    isPending ? "border-yellow-400" : "border-blue-500"
                } transition-all duration-200`}
                onKeyDown={handleKeyDown}>
                <div className="space-y-3">
                    <input
                        id={`edit-title-${task.id}`}
                        type="text"
                        value={editTitle}
                        onChange={e => setEditTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                        placeholder="Task title"
                        disabled={isPending}
                        autoFocus
                        aria-label="Task Title"
                    />

                    <textarea
                        id={`edit-description-${task.id}`}
                        value={editDescription}
                        onChange={e => setEditDescription(e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="Description (optional)"
                        rows={3}
                        disabled={isPending}
                        aria-label="Task Description"
                    />

                    <select
                        id={`edit-status-${task.id}`}
                        value={editStatus}
                        onChange={e => setEditStatus(e.target.value as TaskStatus)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        disabled={isPending}>
                        <option value="Todo">Todo</option>
                        <option value="InProgress">In Progress</option>
                        <option value="Done">Done</option>
                    </select>

                    <select
                        id={`edit-priority-${task.id}`}
                        value={editPriority}
                        onChange={e => setEditPriority(e.target.value as TaskPriority)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        disabled={isPending}>
                        <option value="Low">Low Priority</option>
                        <option value="Medium">Medium Priority</option>
                        <option value="High">High Priority</option>
                    </select>

                    <input
                        type="date"
                        id={`edit-duedate-${task.id}`}
                        value={editDueDate}
                        onChange={e => setEditDueDate(e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        disabled={isPending}
                    />

                    <div className="flex gap-2 pt-2">
                        <button
                            onClick={handleSave}
                            disabled={isPending || !editTitle.trim()}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-neutral-400 disabled:cursor-not-allowed transition-all duration-200">
                            {isPending ? "Saving..." : "Save"}
                        </button>
                        <button
                            onClick={handleCancel}
                            disabled={isPending}
                            className="flex-1 px-4 py-2 bg-neutral-200 text-neutral-700 rounded-md text-sm font-medium hover:bg-neutral-300 transition-all duration-200">
                            Cancel
                        </button>
                    </div>
                </div>
            </article>
        );
    }

    const overdueClass = isOverdue(task.dueDate) ? "border-l-4 border-l-red-500" : "";

    return (
        <>
            <article
                ref={setNodeRef}
                style={style}
                {...listeners}
                {...attributes}
                role="article"
                aria-labelledby={`task-title-${task.id}`}
                className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-4 border border-neutral-200 ${overdueClass} ${
                    isDragging ? "opacity-50 shadow-lg scale-105 cursor-grabbing" : "cursor-grab hover:-translate-y-1"
                }`}
                tabIndex={0}>
                <h3 id={`task-title-${task.id}`} className="font-semibold text-base text-neutral-900 mb-2">
                    {task.title}
                </h3>

                {task.description && <p className="text-sm text-neutral-600 mb-3 line-clamp-3">{task.description}</p>}

                <div className="flex flex-wrap gap-2 mb-3">
                    <span
                        className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${
                            STATUS_COLORS[task.status]
                        }`}
                        role="status">
                        {task.status}
                    </span>
                    <span
                        className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${
                            PRIORITY_COLORS[task.priority]
                        }`}
                        role="status">
                        {task.priority}
                    </span>
                </div>

                {task.dueDate && (
                    <p
                        className={`text-xs mb-3 font-medium ${
                            isOverdue(task.dueDate) ? "text-red-600" : "text-neutral-600"
                        }`}>
                        {isOverdue(task.dueDate) && (
                            <span className="inline-block px-2 py-1 bg-red-100 text-red-700 rounded-md mr-2 font-semibold">
                                OVERDUE
                            </span>
                        )}
                        Due: {formatDate(task.dueDate)}
                    </p>
                )}

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
                    <button
                        onClick={() => setIsEditing(true)}
                        disabled={isDeleting}
                        className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-all">
                        Edit
                    </button>
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        disabled={isDeleting}
                        className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-md transition-all">
                        {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </article>

            {showDeleteConfirm && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                    onClick={() => setShowDeleteConfirm(false)}>
                    <div
                        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
                        onClick={e => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-3">Delete Task</h2>
                        <p className="text-neutral-600 mb-6">
                            Are you sure you want to delete "{task.title}"? This action cannot be undone.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-4 py-2 bg-neutral-200 rounded-md hover:bg-neutral-300">
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    deleteTaskMutation(task.id);
                                    setShowDeleteConfirm(false);
                                }}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
