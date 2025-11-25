import React, { useState } from "react";
import { useCreateTask } from "../hooks/useTasks";

export function CreateTaskForm() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState<"Todo" | "InProgress" | "Done">("Todo");

    const { mutate, isPending } = useCreateTask();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        mutate(
            {
                title: title.trim(),
                description: description.trim() || undefined,
                status,
                boardId: 1, // hardcoded for now
            },
            {
                onSuccess: () => {
                    setTitle("");
                    setDescription("");
                    setStatus("Todo");
                },
            }
        );
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg shadow mb-6">
            <h2 className="text-xl font-bold text-neutral-900 mb-4">Create New Task</h2>

            <div className="space-y-3">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-1">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter task title"
                        required
                        disabled={isPending}
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-1">
                        Description
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter task description (optional)"
                        rows={3}
                        disabled={isPending}
                    />
                </div>

                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-neutral-700 mb-1">
                        Status
                    </label>
                    <select
                        id="status"
                        value={status}
                        onChange={e => setStatus(e.target.value as "Todo" | "InProgress" | "Done")}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isPending}>
                        <option value="Todo">Todo</option>
                        <option value="InProgress">In Progress</option>
                        <option value="Done">Done</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={isPending || !title.trim()}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-neutral-400 disabled:cursor-not-allowed transition-colors">
                    {isPending ? "Creating..." : "Create Task"}
                </button>
            </div>
        </form>
    );
}
