import React, { useState } from "react";
import { useCreateTask } from "../hooks";
import { DEFAULT_BOARD_ID } from "../../../app/constants";

export function CreateTaskForm() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("Todo");
    const [priority, setPriority] = useState("Medium");
    const [dueDate, setDueDate] = useState("");
    const { mutate } = useCreateTask();

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
                boardId: DEFAULT_BOARD_ID,
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
        <form onSubmit={handleSubmit}>
            {/* ...existing form fields... */}
            <button type="submit">Create Task</button>
        </form>
    );
}
