import { API_BASE_URL } from "./constants";

export class ApiError extends Error {
    constructor(message: string, public status: number, public statusText: string) {
        super(message);
        this.name = "ApiError";
    }
}

export async function apiClient<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
    };

    if (options?.body && typeof options.body === "object") {
        config.body = JSON.stringify(options.body);
    }

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            let errorMessage = `API Error: ${response.status} ${response.statusText}`;

            try {
                const contentType = response.headers.get("content-type");
                if (contentType?.includes("application/json")) {
                    const errorData = await response.json();

                    if (errorData.errors) {
                        const messages = Object.values(errorData.errors).flat().filter(Boolean);
                        errorMessage = messages.join(", ");
                    } else if (errorData.title) {
                        errorMessage = errorData.title;
                    } else if (typeof errorData === "string") {
                        errorMessage = errorData;
                    }
                } else {
                    const text = await response.text();
                    if (text) errorMessage = text;
                }
            } catch {
                // Use default error message
            }

            throw new ApiError(errorMessage, response.status, response.statusText);
        }

        if (response.status === 204) {
            return undefined as T;
        }

        return (await response.json()) as T;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new Error(`Network error: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
}
