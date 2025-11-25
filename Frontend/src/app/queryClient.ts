import { QueryClient } from "@tanstack/react-query";
import { QUERY_CONFIG } from "./constants";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: QUERY_CONFIG.STALE_TIME,
            refetchInterval: QUERY_CONFIG.REFETCH_INTERVAL,
            retry: QUERY_CONFIG.RETRY,
            refetchOnWindowFocus: QUERY_CONFIG.REFETCH_ON_WINDOW_FOCUS,
        },
    },
});
