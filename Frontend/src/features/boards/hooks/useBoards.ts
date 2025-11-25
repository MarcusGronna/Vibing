import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getBoards, getBoard, createBoard, updateBoard, deleteBoard } from "../api/boardsApi";
import { Board } from "../types/Board";
import { QUERY_KEYS } from "../../../app/constants";

export function useBoards() {
    return useQuery({
        queryKey: QUERY_KEYS.BOARDS,
        queryFn: getBoards,
    });
}

export function useBoard(id: number) {
    return useQuery({
        queryKey: QUERY_KEYS.BOARD(id),
        queryFn: () => getBoard(id),
        enabled: !!id,
    });
}

export function useCreateBoard() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Partial<Board>) => createBoard(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BOARDS });
            toast.success("Board created successfully");
        },
        onError: (error: Error) => {
            toast.error(`Failed to create board: ${error.message}`);
        },
    });
}

export function useUpdateBoard() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<Board> }) => updateBoard(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BOARDS });
            toast.success("Board updated successfully");
        },
        onError: (error: Error) => {
            toast.error(`Failed to update board: ${error.message}`);
        },
    });
}

export function useDeleteBoard() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteBoard(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BOARDS });
            toast.success("Board deleted successfully");
        },
        onError: (error: Error) => {
            toast.error(`Failed to delete board: ${error.message}`);
        },
    });
}
