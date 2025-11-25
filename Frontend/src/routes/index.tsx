import React from "react";
import { Link } from "@tanstack/react-router";

export default function IndexRoute() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Ready</h1>
      <Link
        to="/kanban"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Go to Kanban Board
      </Link>
    </div>
  );
}
