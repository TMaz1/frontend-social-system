import { Navigate, Outlet } from "react-router-dom";
import { useCurrentUsername } from "../hooks/user/useCurrentUsername";

export const GuestRoute: React.FC = () => {
    const username = useCurrentUsername();
    
    // WAIT until auth is resolved
    if (username === undefined) {
        return null; // or a loader
    }

    // Logged in → redirect
    if (username) {
        return <Navigate to={`/profile/${username}`} replace />;
    }

    // Not logged in → allow access
    return <Outlet />;
};