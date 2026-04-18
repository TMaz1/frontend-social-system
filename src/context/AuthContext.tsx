import React, { createContext, useEffect, useState } from "react";

interface AuthState {
    userId: string | null;
    token: string | null;
    username: string | null;
}

interface AuthContextType {
    userId: string | null;
    token: string | null;
    username: string | null;
    isReady: boolean;
    login: (u: { userId: string; token: string, username: string }) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    userId: null,
    token: null,
    username: null,
    isReady: false,
    login: () => { },
    logout: () => { }
});

export const AuthProvider: React.FC<{ children: any }> = ({ children }) => {
    const [auth, setAuth] = useState<AuthState>({
        userId: null,
        token: null,
        username: null,
    });

    const [isReady, setIsReady] = useState(false);

    // react hydrates AFTER mount
    useEffect(() => {
        const userId = localStorage.getItem("auth_userId");
        const token = localStorage.getItem("auth_token");
        const username = localStorage.getItem("auth_username");

        setAuth({ userId, token, username });
        setIsReady(true);
    }, []);

    const login = ({ userId, token, username }: { userId: string; token: string; username: string; }) => {
        localStorage.setItem("auth_userId", userId);
        localStorage.setItem("auth_token", token);
        localStorage.setItem("auth_username", username);

        setAuth({ userId, token, username });
    };

    const logout = () => {
        localStorage.removeItem("auth_userId");
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_username");

        setAuth({ userId: null, token: null, username: null });
    };

    return (
        <AuthContext.Provider value={{ ...auth, login, logout, isReady }}>
            {children}
        </AuthContext.Provider>
    );
};