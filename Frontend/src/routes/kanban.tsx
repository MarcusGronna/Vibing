import React from "react";
import { useTasks } from "../hooks/useTasks";
import { TaskColumn } from "../components/TaskColumn";

export default function KanbanRoute() {
  const { data: tasks, isLoading, error } = useTasks();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-neutral-600">Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">Error loading tasks: {(error as Error).message}</p>
      </div>
    );
  }

  const todo = tasks?.filter((t) => t.status === "Todo") ?? [];
  const inProgress = tasks?.filter((t) => t.status === "InProgress") ?? [];
  const done = tasks?.filter((t) => t.status === "Done") ?? [];

  return (
    <div className="min-h-screen bg-neutral-100 p-6">
      <h1 className="text-3xl font-bold text-neutral-900 mb-6">Kanban Board</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TaskColumn title="Todo" tasks={todo} />
        <TaskColumn title="In Progress" tasks={inProgress} />
        <TaskColumn title="Done" tasks={done} />
      </div>
    </div>
  );
}
