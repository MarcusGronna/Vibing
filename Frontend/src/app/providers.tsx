import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { queryClient } from "./queryClient";
import { router } from "../router";
import { ErrorBoundary } from "./ErrorBoundary";

interface ProvidersProps {
    children?: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
    return (
        <ErrorBoundary>
            <QueryClientProvider client={queryClient}>
                <ToastContainer position="top-right" autoClose={3000} />
                {children ?? <RouterProvider router={router} />}
            </QueryClientProvider>
        </ErrorBoundary>
    );
}
