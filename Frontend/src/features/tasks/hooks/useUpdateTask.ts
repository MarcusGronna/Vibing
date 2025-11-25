import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { updateTask } from "../api/tasksApi";
import { TaskItem } from "../types/TaskItem";
import { QUERY_KEYS } from "../../../app/constants";

export function useUpdateTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<TaskItem> }) => updateTask(id, data),

        onMutate: async ({ id, data }) => {
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.TASKS });

            const previousTasks = queryClient.getQueryData<TaskItem[]>(QUERY_KEYS.TASKS);

            if (previousTasks) {
                queryClient.setQueryData<TaskItem[]>(
                    QUERY_KEYS.TASKS,
                    previousTasks.map(task => (task.id === id ? { ...task, ...data } : task))
                );
            }

            return { previousTasks };
        },

        onError: (error: Error, _variables, context) => {
            if (context?.previousTasks) {
                queryClient.setQueryData(QUERY_KEYS.TASKS, context.previousTasks);
            }
            toast.error(`Failed to update task: ${error.message}`);
        },

        onSuccess: () => {
            toast.success("Task updated successfully");
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS });
        },
    });
}
