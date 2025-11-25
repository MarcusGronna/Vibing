import React, { useState } from "react";
import { useCreateTask } from "../hooks/useTasks";

export function CreateTaskForm() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState<"Todo" | "InProgress" | "Done">("Todo");
    const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Medium");
    const [dueDate, setDueDate] = useState("");

    const { mutate, isPending } = useCreateTask();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        mutate(
            {
                title: title.trim(),
                description: description.trim() || undefined,
                status,
                priority,
                dueDate: dueDate || undefined,
                boardId: 1, // hardcoded for now
            },
            {
                onSuccess: () => {
                    setTitle("");
                    setDescription("");
                    setStatus("Todo");
                    setPriority("Medium");
                    setDueDate("");
                },
            }
        );
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="p-4 sm:p-6 bg-white rounded-lg shadow-sm border border-neutral-200 mb-6"
            aria-label="Create new task form">
            <h2 className="text-xl font-bold text-neutral-900 mb-6">Create New Task</h2>

            <div className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-2">
                        Title{" "}
                        <span className="text-red-500" aria-label="required">
                            *
                        </span>
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter task title"
                        required
                        disabled={isPending}
                        aria-required="true"
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-2">
                        Description
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter task description (optional)"
                        rows={3}
                        disabled={isPending}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-neutral-700 mb-2">
                            Status
                        </label>
                        <select
                            id="status"
                            value={status}
                            onChange={e => setStatus(e.target.value as "Todo" | "InProgress" | "Done")}
                            className="w-full px-3 py-2 border border-neutral-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            disabled={isPending}>
                            <option value="Todo">Todo</option>
                            <option value="InProgress">In Progress</option>
                            <option value="Done">Done</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="priority" className="block text-sm font-medium text-neutral-700 mb-2">
                            Priority
                        </label>
                        <select
                            id="priority"
                            value={priority}
                            onChange={e => setPriority(e.target.value as "Low" | "Medium" | "High")}
                            className="w-full px-3 py-2 border border-neutral-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            disabled={isPending}>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="dueDate" className="block text-sm font-medium text-neutral-700 mb-2">
                            Due Date
                        </label>
                        <input
                            id="dueDate"
                            type="date"
                            value={dueDate}
                            onChange={e => setDueDate(e.target.value)}
                            className="w-full px-3 py-2 border border-neutral-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            disabled={isPending}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isPending || !title.trim()}
                    className="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-neutral-400 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98]"
                    aria-label="Create new task">
                    {isPending ? "Creating..." : "Create Task"}
                </button>
            </div>
        </form>
    );
}
