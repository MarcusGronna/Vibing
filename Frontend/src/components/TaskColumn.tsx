import React from "react";
import { TaskItem } from "../types/TaskItem";
import { TaskCard } from "./TaskCard";

interface TaskColumnProps {
  title: string;
  tasks: TaskItem[];
}

export function TaskColumn({ title, tasks }: TaskColumnProps) {
  return (
    <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
      <h2 className="text-lg font-bold text-neutral-800 mb-4">{title}</h2>
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <p className="text-sm text-neutral-500 italic">No tasks</p>
        ) : (
          tasks.map((task) => <TaskCard key={task.id} task={task} />)
        )}
      </div>
    </div>
  );
}
