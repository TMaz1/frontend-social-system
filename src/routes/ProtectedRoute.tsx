import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/auth/useAuth";

export const ProtectedRoute = () => {
    const { isAuthenticated, isReady } = useAuth();

    // If auth system is still initialising, don't decide anything yet
    if (!isReady) {
        return null; // NOTE: AppSkeletonOverlay already handles global loading
    }

    // Not logged in → redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Auth OK → render protected routes
    return <Outlet />;
};