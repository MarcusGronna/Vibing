export function isToday(dateString?: string): boolean {
    if (!dateString) return false;
    const date = new Date(dateString);
    const today = new Date();
    return (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
    );
}

export function isThisWeek(dateString?: string): boolean {
    if (!dateString) return false;
    const date = new Date(dateString);
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
    return date >= weekStart && date <= weekEnd;
}

export function isOverdue(dateString?: string): boolean {
    if (!dateString) return false;
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
}

export function formatDate(dateString?: string): string {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString();
}
