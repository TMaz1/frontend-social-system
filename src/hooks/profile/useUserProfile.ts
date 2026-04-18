import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import {
    localDataService,
    type User,
} from "../../services/localDataService";
import { AsyncStatus, type AsyncResult } from "../../types/asyncState";

type ProfileData = {
    profileUser: User;
    isOwnProfile: boolean;
};

export const useUserProfile = (): AsyncResult<ProfileData> => {
    const { name } = useParams();
    const { userId: loggedInUserId, isReady } = useAuth();

    const [profileUser, setProfileUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setIsLoading(true);

            await localDataService.init();

            const users = localDataService.getUsers();
            const found = users.find((u) => u.username === name);

            setProfileUser(found ?? null);
            setIsLoading(false);
        };

        if (name) {
            load();
        }
    }, [name]);

    // =========================
    // STATUS HANDLING
    // =========================

    if (!isReady || isLoading) {
        return { status: AsyncStatus.Loading };
    }

    if (!profileUser) {
        return { status: AsyncStatus.NotFound };
    }

    const isOwnProfile =
        profileUser.userId === loggedInUserId;

    return {
        status: AsyncStatus.Ready,
        data: {
            profileUser,
            isOwnProfile,
        },
    };
};