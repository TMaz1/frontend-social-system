import { useCallback } from "react";
import { localDataService } from "../../services/localDataService";
import { useUserData } from "../user/useUserData";
import {
    AuthStatus,
    type AuthAsyncResult,
} from "../../types/asyncState";

type UpdatePasswordInput = {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
};

type UpdatePasswordResult = {
    success: boolean;
    error?: string;
};

type UpdatePasswordData = {
    updatePassword: (
        input: UpdatePasswordInput
    ) => UpdatePasswordResult;
};

export const useUpdatePassword = (): AuthAsyncResult<UpdatePasswordData> => {
    const userResult = useUserData();

    // =========================
    // STATUS HANDLING
    // =========================

    if (userResult.status !== AuthStatus.Ready) {
        return userResult;
    }

    const { userId } = userResult.data;

    // =========================
    // ACTION
    // =========================

    const updatePassword = useCallback(
        ({
            oldPassword,
            newPassword,
            confirmPassword,
        }: UpdatePasswordInput): UpdatePasswordResult => {
            // VALIDATION
            if (!oldPassword || !newPassword || !confirmPassword) {
                return {
                    success: false,
                    error: "All fields are required.",
                };
            }

            const latestUser =
                localDataService.getUserById(userId);

            if (!latestUser || oldPassword !== latestUser.password) {
                return {
                    success: false,
                    error: "Old password is incorrect.",
                };
            }

            if (newPassword !== confirmPassword) {
                return {
                    success: false,
                    error: "New passwords do not match.",
                };
            }

            // UPDATE
            const updatedUser = {
                ...latestUser,
                password: newPassword,
            };

            const ok = localDataService.updateUser(
                userId,
                updatedUser
            );

            if (!ok) {
                return {
                    success: false,
                    error: "Failed to update password.",
                };
            }

            return {
                success: true,
            };
        },
        [userId]
    );

    // =========================
    // RETURN
    // =========================

    return {
        status: AuthStatus.Ready,
        data: {
            updatePassword,
        },
    };
};