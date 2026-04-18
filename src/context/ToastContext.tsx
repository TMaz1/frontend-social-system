import React, { createContext, useContext, useState, type ReactNode } from "react";
import styles from "../components/Toast/Toast.module.scss";

interface Toast {
    id: string;
    content: ReactNode;
    exiting?: boolean;
}

interface ToastContextProps {
    showToast: (content: ReactNode, duration?: number) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used within ToastProvider");
    return ctx;
};

const MAX_TOASTS = 5;
const DEFAULT_DURATION = 5000;
const EXIT_ANIMATION_MS = 300;

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = (content: ReactNode, duration = DEFAULT_DURATION) => {
        const id = crypto.randomUUID();

        setToasts((prev) => {
            // prevent toast spam: ignore new request if a toast with the same string content already exists
            if (typeof content === "string") {
                const duplicate = prev.some(
                    (t) => typeof t.content === "string" && t.content === content
                );
                
                if (duplicate) return prev;
            }

            const newToast: Toast = { id, content };
            const updated = [...prev, newToast];

            // keep only most recent MAX_TOAST. older toasts are removed
            return updated.length > MAX_TOASTS
                ? updated.slice(updated.length - MAX_TOASTS)
                : updated;
        });

        // automatically trigger exit animation after toast duration
        setTimeout(() => {
            startExitAnimation(id);
        }, duration);
    };

    const startExitAnimation = (id: string) => {
        setToasts((prev) =>
            prev.map((t) =>
                t.id === id && !t.exiting ? { ...t, exiting: true } : t
            )
        );

        // remove toast after CSS exit animation finishes
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, EXIT_ANIMATION_MS);
    };

    const removeToast = (id: string) => {
        startExitAnimation(id);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* aria-live ensures screen readers announce new messages */}
            <div
                className={styles.toastContainer}
                role="status"
                aria-live="polite"
            >
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        onClick={() => removeToast(t.id)}
                        className={`${styles.toast} ${t.exiting ? styles.exiting : ""
                            }`}
                    >
                        <div className={styles.toastContent}>{t.content}</div>

                        <button
                            className={styles.toastClose}
                            onClick={(e) => {
                                e.stopPropagation();
                                removeToast(t.id);
                            }}
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};