import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTasks, getTask, createTask, updateTask, deleteTask } from "../api/tasks";
import { TaskItem } from "../types/TaskItem";
import { toast } from "react-toastify";

export function useTasks() {
    return useQuery({
        queryKey: ["tasks"],
        queryFn: getTasks,
        staleTime: 30_000, // 30 seconds
        refetchInterval: 15_000, // refetch every 15 seconds
        retry: 2,
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
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
            toast.success("Task created successfully");
        },
        onError: (error: Error) => {
            toast.error(`Failed to create task: ${error.message}`);
        },
    });
}

export function useUpdateTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<TaskItem> }) => updateTask(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
    });
}

export function useDeleteTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteTask(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
    });
}
