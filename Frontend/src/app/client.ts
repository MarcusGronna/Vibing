import { API_BASE_URL } from "./constants";

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

    const response = await fetch(url, config);

    if (!response.ok) {
        const text = await response.text().catch(() => "");
        let errorMessage = `API Error: ${response.status} ${response.statusText}`;

        try {
            const errorData = JSON.parse(text);
            if (errorData.errors) {
                // ASP.NET validation errors format
                const messages = Object.values(errorData.errors).flat();
                errorMessage = messages.join(", ");
            } else if (errorData.title) {
                errorMessage = errorData.title;
            } else if (typeof errorData === "string") {
                errorMessage = errorData;
            }
        } catch {
            if (text) errorMessage = text;
        }

        throw new Error(errorMessage);
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return response.json() as Promise<T>;
}
