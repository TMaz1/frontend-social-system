import { AuthStatus } from "../../types/asyncState";
import { useUserData } from "./useUserData";

export const useCurrentUsername = () => {
    const result = useUserData();

    if (result.status !== AuthStatus.Ready) return null;

    return result.data.user.username;
};