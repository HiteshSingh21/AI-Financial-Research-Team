import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getUserId(): string {
    if (typeof window === "undefined") return "default_user";
    let userId = localStorage.getItem("financial_ai_user_id");
    if (!userId) {
        userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        localStorage.setItem("financial_ai_user_id", userId);
    }
    return userId;
}

export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function truncate(str: string, length: number): string {
    if (str.length <= length) return str;
    return str.substring(0, length) + "...";
}
