import React, { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { TaskItem, TaskStatus, TaskPriority } from "../types";
import { useUpdateTask, useDeleteTask } from "../hooks";
import { isOverdue, formatDate } from "../../../utils/dateUtils";
import { PRIORITY_COLORS, STATUS_COLORS } from "../../../app/constants";
import { ConfirmDialog } from "./ConfirmDialog";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Badge } from "../../../components/ui/Badge";

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
                className={`card border-2 ${isPending ? "border-yellow-400" : "border-blue-500"}`}
                onKeyDown={handleKeyDown}>
                <div className="space-y-3">
                    <Input
                        id={`edit-title-${task.id}`}
                        value={editTitle}
                        onChange={e => setEditTitle(e.target.value)}
                        placeholder="Task title"
                        disabled={isPending}
                        autoFocus
                        required
                        aria-label="Task Title"
                    />

                    <div>
                        <label htmlFor={`edit-description-${task.id}`} className="sr-only">
                            Task Description
                        </label>
                        <textarea
                            id={`edit-description-${task.id}`}
                            value={editDescription}
                            onChange={e => setEditDescription(e.target.value)}
                            className="input-base text-sm"
                            placeholder="Description (optional)"
                            rows={3}
                            disabled={isPending}
                        />
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor={`edit-status-${task.id}`}
                            className="block text-sm font-medium text-neutral-700">
                            Status
                        </label>
                        <select
                            id={`edit-status-${task.id}`}
                            value={editStatus}
                            onChange={e => setEditStatus(e.target.value as TaskStatus)}
                            className="input-base text-sm"
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
                            onChange={e => setEditPriority(e.target.value as TaskPriority)}
                            className="input-base text-sm"
                            disabled={isPending}>
                            <option value="Low">Low Priority</option>
                            <option value="Medium">Medium Priority</option>
                            <option value="High">High Priority</option>
                        </select>
                    </div>

                    <Input
                        type="date"
                        id={`edit-duedate-${task.id}`}
                        value={editDueDate}
                        onChange={e => setEditDueDate(e.target.value)}
                        label="Due Date"
                        disabled={isPending}
                    />

                    <div className="flex gap-2 pt-2">
                        <Button
                            onClick={handleSave}
                            disabled={isPending || !editTitle.trim()}
                            className="flex-1"
                            aria-label="Save task changes">
                            {isPending ? "Saving..." : "Save"}
                        </Button>
                        <Button
                            onClick={handleCancel}
                            disabled={isPending}
                            variant="secondary"
                            className="flex-1"
                            aria-label="Cancel editing">
                            Cancel
                        </Button>
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
                className={`card hover:shadow-md transition-all duration-200 ${overdueClass} ${
                    isDragging ? "opacity-50 shadow-lg scale-105 cursor-grabbing" : "cursor-grab hover:-translate-y-1"
                }`}
                tabIndex={0}>
                <h3 id={`task-title-${task.id}`} className="font-semibold text-base text-neutral-900 mb-2">
                    {task.title}
                </h3>

                {task.description && <p className="text-sm text-neutral-600 mb-3 line-clamp-3">{task.description}</p>}

                <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="status" color={STATUS_COLORS[task.status]} ariaLabel={`Status: ${task.status}`}>
                        {task.status}
                    </Badge>
                    <Badge
                        variant="priority"
                        color={PRIORITY_COLORS[task.priority]}
                        ariaLabel={`Priority: ${task.priority}`}>
                        {task.priority}
                    </Badge>
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
                        onClick={() => setShowDeleteConfirm(true)}
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
                onConfirm={() => deleteTaskMutation(task.id)}
                onCancel={() => setShowDeleteConfirm(false)}
            />
        </>
    );
}
