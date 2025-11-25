import React from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { queryClient } from "./hooks/useQueryClient";
import { router } from "./router";
import "./styles/globals.css";

import { RouterProvider } from "@tanstack/react-router";

const root = createRoot(document.getElementById("root")!);

root.render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <ToastContainer position="top-right" />
            <RouterProvider router={router} />
        </QueryClientProvider>
    </React.StrictMode>
);
