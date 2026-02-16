"use client";

import * as React from "react";
import {
    ToastProvider,
    ToastViewport,
    Toast,
    ToastTitle,
    ToastDescription,
    ToastClose,
} from "@/components/ui/toast";

type ToastVariant = "default" | "success" | "error";

interface ToastItem {
    id: string;
    title: string;
    description?: string;
    variant?: ToastVariant;
}

interface ToastContextType {
    toast: (options: Omit<ToastItem, "id">) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function useToast() {
    const context = React.useContext(ToastContext);
    if (!context) throw new Error("useToast must be used within ToasterProvider");
    return context;
}

export function Toaster({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = React.useState<ToastItem[]>([]);

    const toast = React.useCallback((options: Omit<ToastItem, "id">) => {
        const id = Date.now().toString();
        setToasts((prev) => [...prev, { ...options, id }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    }, []);

    return (
        <ToastContext.Provider value={{ toast }}>
            <ToastProvider>
                {children}
                {toasts.map((t) => (
                    <Toast key={t.id} variant={t.variant}>
                        <div className="grid gap-1">
                            <ToastTitle>{t.title}</ToastTitle>
                            {t.description && (
                                <ToastDescription>{t.description}</ToastDescription>
                            )}
                        </div>
                        <ToastClose />
                    </Toast>
                ))}
                <ToastViewport />
            </ToastProvider>
        </ToastContext.Provider>
    );
}
