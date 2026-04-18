import React, { createContext, useContext, useEffect, useState } from "react";
import { type CardLayout, DEFAULT_LAYOUT, LOCAL_KEYS } from "../services/localDataService";
import { AuthContext } from "./AuthContext";

interface LayoutContextValue {
    layout: CardLayout;
    setLayout: (l: CardLayout) => void;
}

const LayoutContext = createContext<LayoutContextValue | null>(null);

export const LayoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { userId } = useContext(AuthContext);
    const [layout, setLayoutState] = useState<CardLayout>(DEFAULT_LAYOUT);

    // Load on mount / user change
    useEffect(() => {
        const raw = localStorage.getItem(LOCAL_KEYS.layout);
        if (!raw) return;

        const parsed = JSON.parse(raw);
        if (userId && parsed[userId]) {
            setLayoutState(parsed[userId]);
        } else if (!userId && parsed.__guest) {
            setLayoutState(parsed.__guest);
        }
    }, [userId]);

    const setLayout = (newLayout: CardLayout) => {
        setLayoutState(newLayout);

        const raw = localStorage.getItem(LOCAL_KEYS.layout);
        const parsed = raw ? JSON.parse(raw) : {};

        if (userId) {
            parsed[userId] = newLayout;
        } else {
            parsed.__guest = newLayout;
        }

        localStorage.setItem(LOCAL_KEYS.layout, JSON.stringify(parsed));
    };

    return (
        <LayoutContext.Provider value={{ layout, setLayout }}>
            {children}
        </LayoutContext.Provider>
    );
};

export const useLayout = () => {
    const ctx = useContext(LayoutContext);
    if (!ctx) throw new Error("useLayout must be used inside LayoutProvider");
    return ctx;
};