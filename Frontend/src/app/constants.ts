export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5147";

export const DEFAULT_BOARD_ID = 1;

export const QUERY_KEYS = {
    TASKS: ["tasks"] as const,
    TASK: (id: number) => ["tasks", id] as const,
    BOARDS: ["boards"] as const,
    BOARD: (id: number) => ["boards", id] as const,
} as const;

export const QUERY_CONFIG = {
    STALE_TIME: 30_000,
    REFETCH_INTERVAL: 15_000,
    RETRY: 2,
    REFETCH_ON_WINDOW_FOCUS: false,
} as const;

export const TOAST_CONFIG = {
    POSITION: "top-right" as const,
    AUTO_CLOSE: 3000,
} as const;

export const PRIORITY_COLORS = {
    Low: "bg-green-100 text-green-800",
    Medium: "bg-yellow-100 text-yellow-800",
    High: "bg-red-100 text-red-800",
} as const;

export const STATUS_COLORS = {
    Todo: "bg-blue-100 text-blue-800",
    InProgress: "bg-yellow-100 text-yellow-800",
    Done: "bg-green-100 text-green-800",
} as const;
