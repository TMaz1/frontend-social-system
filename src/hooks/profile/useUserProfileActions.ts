import { useCallback } from "react";
import { useUserData } from "../user/useUserData";
import { localDataService, type User } from "../../services/localDataService";
import { AuthStatus } from "../../types/asyncState";

type UpdateUserResult = {
    success: boolean;
    error?: string;
};

export const useUserProfileActions = () => {
    const userResult = useUserData();

    if (userResult.status !== AuthStatus.Ready) {
        return {
            status: userResult.status,
            data: null,
        };
    }

    const { userId } = userResult.data;

    const updateUser = useCallback(
        (updated: User): UpdateUserResult => {
            try {
                const ok = localDataService.updateUser(userId, updated);

                if (!ok) {
                    return {
                        success: false,
                        error: "Failed to update user.",
                    };
                }

                return { success: true };
            } catch (err) {
                return {
                    success: false,
                    error: err instanceof Error
                        ? err.message
                        : "Unexpected error occurred.",
                };
            }
        },
        [userId]
    );


    return {
        status: AuthStatus.Ready,
        data: {
            updateUser,
        },
    };
};