# Vibe Coding Project

## Structure

-   `Frontend/` - React + TypeScript + Vite + TanStack Query/Router + Tailwind v4
-   `Backend/` - .NET Minimal API + EF Core + SQLite

## Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

Runs on http://localhost:5173

## Backend Setup

```bash
cd Backend
dotnet restore
dotnet ef database update
dotnet run
```

Runs on http://localhost:5000 (or configured port)

## Development

-   Frontend talks to Backend via `/boards` and `/tasks` endpoints.
-   CORS is configured for `http://localhost:5173`.
