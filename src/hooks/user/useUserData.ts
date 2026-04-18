import { useAuth } from "../auth/useAuth";
import { localDataService } from "../../services/localDataService";
import { AuthStatus, type AuthAsyncResult } from "../../types/asyncState";
import type { User } from "../../services/localDataService";

type UserData = {
    userId: string;
    user: User;
};

export const useUserData = (): AuthAsyncResult<UserData> => {
    const { userId, isReady } = useAuth();

    if (!isReady) {
        return { status: AuthStatus.Loading };
    }

    if (!userId) {
        return { status: AuthStatus.Unauthenticated };
    }

    const user = localDataService.getUserById(userId);

    if (!user) {
        return { status: AuthStatus.NotFound };
    }

    return {
        status: AuthStatus.Ready,
        data: {
            userId,
            user,
        },
    };
};