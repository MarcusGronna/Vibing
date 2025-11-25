import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { queryClient } from "./queryClient";
import { router } from "../router";
import { ErrorBoundary } from "./ErrorBoundary";
import { TOAST_CONFIG } from "./constants";

interface ProvidersProps {
    children?: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
    return (
        <ErrorBoundary>
            <QueryClientProvider client={queryClient}>
                <ToastContainer position={TOAST_CONFIG.POSITION} autoClose={TOAST_CONFIG.AUTO_CLOSE} />
                {children ?? <RouterProvider router={router} />}
            </QueryClientProvider>
        </ErrorBoundary>
    );
}
