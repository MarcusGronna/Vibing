export async function fetcher<T = unknown>(input: RequestInfo, init?: RequestInit): Promise<T> {
    const res = await fetch(input, init);
    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Network error: ${res.status} ${res.statusText} ${text}`);
    }
    return (await res.json()) as T;
}
