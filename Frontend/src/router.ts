import { createBrowserRouter } from "@tanstack/react-router";
import IndexRoute from "./routes/index";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <IndexRoute />,
    },
]);
