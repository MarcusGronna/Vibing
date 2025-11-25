const API_BASE = "http://localhost:5146"; // adjust to your backend port

export async function api<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE}${endpoint}`;

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
        throw new Error(`API Error: ${response.status} ${response.statusText} ${text}`);
    }

    // Handle 204 No Content
    if (response.status === 204) {
        return undefined as T;
    }

    return response.json() as Promise<T>;
}
