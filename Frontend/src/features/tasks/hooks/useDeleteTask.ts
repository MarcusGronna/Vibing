import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { deleteTask } from "../api/tasksApi";
import { TaskItem } from "../types/TaskItem";
import { QUERY_KEYS } from "../../../app/constants";

export function useDeleteTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => deleteTask(id),

        onMutate: async id => {
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.TASKS });

            const previousTasks = queryClient.getQueryData<TaskItem[]>(QUERY_KEYS.TASKS);

            if (previousTasks) {
                queryClient.setQueryData<TaskItem[]>(
                    QUERY_KEYS.TASKS,
                    previousTasks.filter(task => task.id !== id)
                );
            }

            return { previousTasks };
        },

        onError: (error: Error, _id, context) => {
            if (context?.previousTasks) {
                queryClient.setQueryData(QUERY_KEYS.TASKS, context.previousTasks);
            }
            toast.error(`Failed to delete task: ${error.message}`);
        },

        onSuccess: () => {
            toast.success("Task deleted successfully");
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS });
        },
    });
}
