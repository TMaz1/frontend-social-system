import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export const useAuth = () => {
    const { userId, isReady } = useContext(AuthContext);

    return {
        userId,
        isReady,
        isAuthenticated: !!userId,
    };
};