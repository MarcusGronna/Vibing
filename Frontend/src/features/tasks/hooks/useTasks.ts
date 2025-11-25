import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getTasks, getTask, createTask, updateTask, deleteTask } from "../api";
import { TaskItem } from "../types";

export function useTasks() {
    return useQuery({
        queryKey: ["tasks"],
        queryFn: getTasks,
    });
}

export function useTask(id: number) {
    return useQuery({
        queryKey: ["tasks", id],
        queryFn: () => getTask(id),
        enabled: !!id,
    });
}

export function useCreateTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Partial<TaskItem>) => createTask(data),

        onMutate: async newTask => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: ["tasks"] });

            // Snapshot previous value
            const previousTasks = queryClient.getQueryData<TaskItem[]>(["tasks"]);

            // Optimistically update
            if (previousTasks) {
                const optimisticTask: TaskItem = {
                    id: Date.now(), // Temporary ID
                    title: newTask.title || "",
                    description: newTask.description,
                    status: newTask.status || "Todo",
                    boardId: newTask.boardId || 1,
                    priority: newTask.priority || "Medium",
                    dueDate: newTask.dueDate,
                };

                queryClient.setQueryData<TaskItem[]>(["tasks"], [...previousTasks, optimisticTask]);
            }

            return { previousTasks };
        },

        onError: (error: Error, _newTask, context) => {
            // Rollback on error
            if (context?.previousTasks) {
                queryClient.setQueryData(["tasks"], context.previousTasks);
            }
            toast.error(`Failed to create task: ${error.message}`);
        },

        onSuccess: () => {
            toast.success("Task created successfully");
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
    });
}

export function useUpdateTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<TaskItem> }) => updateTask(id, data),

        onMutate: async ({ id, data }) => {
            await queryClient.cancelQueries({ queryKey: ["tasks"] });

            const previousTasks = queryClient.getQueryData<TaskItem[]>(["tasks"]);

            if (previousTasks) {
                queryClient.setQueryData<TaskItem[]>(
                    ["tasks"],
                    previousTasks.map(task => (task.id === id ? { ...task, ...data } : task))
                );
            }

            return { previousTasks };
        },

        onError: (error: Error, _variables, context) => {
            if (context?.previousTasks) {
                queryClient.setQueryData(["tasks"], context.previousTasks);
            }
            toast.error(`Failed to update task: ${error.message}`);
        },

        onSuccess: () => {
            toast.success("Task updated successfully");
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
    });
}

export function useDeleteTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => deleteTask(id),

        onMutate: async id => {
            await queryClient.cancelQueries({ queryKey: ["tasks"] });

            const previousTasks = queryClient.getQueryData<TaskItem[]>(["tasks"]);

            if (previousTasks) {
                queryClient.setQueryData<TaskItem[]>(
                    ["tasks"],
                    previousTasks.filter(task => task.id !== id)
                );
            }

            return { previousTasks };
        },

        onError: (error: Error, _id, context) => {
            if (context?.previousTasks) {
                queryClient.setQueryData(["tasks"], context.previousTasks);
            }
            toast.error(`Failed to delete task: ${error.message}`);
        },

        onSuccess: () => {
            toast.success("Task deleted successfully");
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
    });
}
