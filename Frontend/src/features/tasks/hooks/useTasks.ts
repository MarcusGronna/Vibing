import { useQuery } from "@tanstack/react-query";
import { getTasks, getTask } from "../api/tasksApi";
import { QUERY_KEYS } from "../../../app/constants";

export function useTasks() {
    return useQuery({
        queryKey: QUERY_KEYS.TASKS,
        queryFn: getTasks,
    });
}

export function useTask(id: number) {
    return useQuery({
        queryKey: QUERY_KEYS.TASK(id),
        queryFn: () => getTask(id),
        enabled: !!id,
    });
}
