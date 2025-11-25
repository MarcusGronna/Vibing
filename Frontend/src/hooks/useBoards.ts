import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBoards, getBoard, createBoard, updateBoard, deleteBoard } from "../api/boards";
import { Board } from "../types/Board";

export function useBoards() {
    return useQuery({
        queryKey: ["boards"],
        queryFn: getBoards,
    });
}

export function useBoard(id: number) {
    return useQuery({
        queryKey: ["boards", id],
        queryFn: () => getBoard(id),
        enabled: !!id,
    });
}

export function useCreateBoard() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<Board>) => createBoard(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["boards"] });
        },
    });
}

export function useUpdateBoard() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<Board> }) => updateBoard(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["boards"] });
        },
    });
}

export function useDeleteBoard() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteBoard(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["boards"] });
        },
    });
}
