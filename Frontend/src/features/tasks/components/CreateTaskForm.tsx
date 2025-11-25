import React, { useState } from "react";
import { useCreateTask } from "../hooks";
import { TaskStatus, TaskPriority } from "../types";
import { DEFAULT_BOARD_ID } from "../../../app/constants";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";

export function CreateTaskForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("Todo");
  const [priority, setPriority] = useState<TaskPriority>("Medium");
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
    <form onSubmit={handleSubmit} className="card sm:p-6 mb-6" aria-label="Create new task form">
      <h2 className="text-xl font-bold text-neutral-900 mb-6">Create New Task</h2>

      <div className="space-y-4">
        <Input
          id="title"
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          label="Title"
          placeholder="Enter task title"
          required
          disabled={isPending}
        />

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="input-base"
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
              onChange={e => setStatus(e.target.value as TaskStatus)}
              className="input-base"
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
              onChange={e => setPriority(e.target.value as TaskPriority)}
              className="input-base"
              disabled={isPending}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <Input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            label="Due Date"
            disabled={isPending}
          />
        </div>

        <Button type="submit" disabled={isPending || !title.trim()} className="w-full py-3">
          {isPending ? "Creating..." : "Create Task"}
        </Button>
      </div>
    </form>
  );
}
