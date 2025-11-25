import { createRouter, createRootRoute, createRoute } from "@tanstack/react-router";
import IndexRoute from "./routes/index";
import KanbanRoute from "./routes/kanban";

const rootRoute = createRootRoute();

const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: IndexRoute,
});

const kanbanRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/kanban",
    component: KanbanRoute,
});

const routeTree = rootRoute.addChildren([indexRoute, kanbanRoute]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}
