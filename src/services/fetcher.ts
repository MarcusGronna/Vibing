export async function fetcher<T = unknown>(input: RequestInfo, init?: RequestInit): Promise<T> {
    const res = await fetch(input, init);
    if (!res.ok) throw new Error(`Network error: ${res.status} ${res.statusText}`);
    return (await res.json()) as T;
}
