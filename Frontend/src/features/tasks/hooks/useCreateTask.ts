import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { createTask } from "../api/tasksApi";
import { TaskItem } from "../types/TaskItem";
import { QUERY_KEYS } from "../../../app/constants";

export function useCreateTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Partial<TaskItem>) => createTask(data),

        onMutate: async newTask => {
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.TASKS });

            const previousTasks = queryClient.getQueryData<TaskItem[]>(QUERY_KEYS.TASKS);

            if (previousTasks) {
                const optimisticTask: TaskItem = {
                    id: Date.now(),
                    title: newTask.title || "",
                    description: newTask.description,
                    status: newTask.status || "Todo",
                    boardId: newTask.boardId || 1,
                    priority: newTask.priority || "Medium",
                    dueDate: newTask.dueDate,
                };

                queryClient.setQueryData<TaskItem[]>(QUERY_KEYS.TASKS, [...previousTasks, optimisticTask]);
            }

            return { previousTasks };
        },

        onError: (error: Error, _newTask, context) => {
            if (context?.previousTasks) {
                queryClient.setQueryData(QUERY_KEYS.TASKS, context.previousTasks);
            }
            toast.error(`Failed to create task: ${error.message}`);
        },

        onSuccess: () => {
            toast.success("Task created successfully");
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS });
        },
    });
}
