import React from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { queryClient } from "./hooks/useQueryClient";
import "./styles/globals.css";
import { App } from "./App";

// Remove RouterProvider/router import — installed @tanstack/react-router doesn't provide the same API.
// Rendering App directly prevents the runtime error while we align router usage to the installed package.
createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <ToastContainer position="top-right" />
            <App />
        </QueryClientProvider>
    </React.StrictMode>
);
