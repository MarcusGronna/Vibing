import React, { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { TaskItem } from "../types";
import { useUpdateTask, useDeleteTask } from "../hooks";
import { isOverdue, formatDate } from "../../../utils/dateUtils";
import { PRIORITY_COLORS, STATUS_COLORS } from "../../../app/constants";
import { ConfirmDialog } from "../../../components/ConfirmDialog";

interface TaskCardProps {
    task: TaskItem;
}

export function TaskCard({ task }: TaskCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
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

    const handleDelete = () => {
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        deleteTaskMutation(task.id);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Escape") {
            handleCancel();
        }
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
                    <label htmlFor={`edit-title-${task.id}`} className="sr-only">
                        Task Title
                    </label>
                    <input
                        id={`edit-title-${task.id}`}
                        type="text"
                        value={editTitle}
                        onChange={e => setEditTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                        placeholder="Task title"
                        disabled={isPending}
                        autoFocus
                        aria-required="true"
                    />

                    <label htmlFor={`edit-description-${task.id}`} className="sr-only">
                        Task Description
                    </label>
                    <textarea
                        id={`edit-description-${task.id}`}
                        value={editDescription}
                        onChange={e => setEditDescription(e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="Description (optional)"
                        rows={3}
                        disabled={isPending}
                    />

                    <div className="space-y-2">
                        <label
                            htmlFor={`edit-status-${task.id}`}
                            className="block text-sm font-medium text-neutral-700">
                            Status
                        </label>
                        <select
                            id={`edit-status-${task.id}`}
                            value={editStatus}
                            onChange={e => setEditStatus(e.target.value as "Todo" | "InProgress" | "Done")}
                            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            disabled={isPending}>
                            <option value="Todo">Todo</option>
                            <option value="InProgress">In Progress</option>
                            <option value="Done">Done</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor={`edit-priority-${task.id}`}
                            className="block text-sm font-medium text-neutral-700">
                            Priority
                        </label>
                        <select
                            id={`edit-priority-${task.id}`}
                            value={editPriority}
                            onChange={e => setEditPriority(e.target.value as "Low" | "Medium" | "High")}
                            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            disabled={isPending}>
                            <option value="Low">Low Priority</option>
                            <option value="Medium">Medium Priority</option>
                            <option value="High">High Priority</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor={`edit-duedate-${task.id}`}
                            className="block text-sm font-medium text-neutral-700">
                            Due Date
                        </label>
                        <input
                            id={`edit-duedate-${task.id}`}
                            type="date"
                            value={editDueDate}
                            onChange={e => setEditDueDate(e.target.value)}
                            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            disabled={isPending}
                        />
                    </div>

                    <div className="flex gap-2 pt-2">
                        <button
                            onClick={handleSave}
                            disabled={isPending || !editTitle.trim()}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-neutral-400 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.97]"
                            aria-label="Save task changes">
                            {isPending ? "Saving..." : "Save"}
                        </button>
                        <button
                            onClick={handleCancel}
                            disabled={isPending}
                            className="flex-1 px-4 py-2 bg-neutral-200 text-neutral-700 rounded-md text-sm font-medium hover:bg-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.97]"
                            aria-label="Cancel editing">
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
                        role="status"
                        aria-label={`Status: ${task.status}`}>
                        {task.status}
                    </span>
                    <span
                        className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${
                            PRIORITY_COLORS[task.priority]
                        }`}
                        role="status"
                        aria-label={`Priority: ${task.priority}`}>
                        {task.priority}
                    </span>
                </div>

                {task.dueDate && (
                    <p
                        className={`text-xs mb-3 font-medium ${
                            isOverdue(task.dueDate) ? "text-red-600" : "text-neutral-600"
                        }`}
                        role="status"
                        aria-live="polite">
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
                        className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97]"
                        aria-label={`Edit task: ${task.title}`}>
                        Edit
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97]"
                        aria-label={`Delete task: ${task.title}`}>
                        {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </article>

            <ConfirmDialog
                isOpen={showDeleteConfirm}
                title="Delete Task"
                message={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
                confirmLabel="Delete"
                cancelLabel="Cancel"
                isDangerous
                onConfirm={confirmDelete}
                onCancel={() => setShowDeleteConfirm(false)}
            />
        </>
    );
}
