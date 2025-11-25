import React from "react";
import { Link } from "@tanstack/react-router";

export default function IndexRoute() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-neutral-100">
            <h1 className="text-3xl font-bold text-neutral-900">Kanban Board</h1>
            <Link
                to="/kanban"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Go to Board
            </Link>
        </div>
    );
}
