export const AsyncStatus = {
    Loading: "LOADING",
    Ready: "READY",
    NotFound: "NOT_FOUND",
    Error: "ERROR",
} as const;

export type AsyncStatus =
    (typeof AsyncStatus)[keyof typeof AsyncStatus];

export const AuthStatus = {
    ...AsyncStatus,
    Unauthenticated: "UNAUTHENTICATED",
} as const;

export type AuthStatus =
    (typeof AuthStatus)[keyof typeof AuthStatus];

// Generic async result
export type AsyncResult<T> =
    | { status: typeof AsyncStatus.Loading }
    | { status: typeof AsyncStatus.NotFound }
    | { status: typeof AsyncStatus.Error; error?: string }
    | { status: typeof AsyncStatus.Ready; data: T };

// Auth-aware result
export type AuthAsyncResult<T> =
    | { status: typeof AuthStatus.Loading }
    | { status: typeof AuthStatus.Unauthenticated }
    | { status: typeof AuthStatus.NotFound }
    | { status: typeof AuthStatus.Error; error?: string }
    | { status: typeof AuthStatus.Ready; data: T };