import { useState, useEffect, useCallback } from "react";
import { localDataService } from "../../services/localDataService";
import { useUserData } from "../user/useUserData";
import { AuthStatus } from "../../types/asyncState";

type SaveCardData = {
    isSaved: boolean;
    toggleSave: () => void;
    isLoading: boolean;
    isAuthenticated: boolean;
};

export const useSaveCard = (cardId: string): SaveCardData => {
    const userResult = useUserData();

    const [isSaved, setIsSaved] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const isAuthenticated = userResult.status === AuthStatus.Ready;

    // =========================
    // LOAD SAVE STATE
    // =========================
    useEffect(() => {
        if (!isAuthenticated) {
            setIsSaved(false);
            setIsLoading(false);
            return;
        }

        const load = () => {
            setIsLoading(true);

            const state =
                localDataService.getUserStateById(
                    userResult.data.userId
                );

            const saved = state?.savedCards ?? [];

            setIsSaved(saved.includes(cardId));
            setIsLoading(false);
        };

        load();
    }, [userResult, cardId, isAuthenticated]);

    // =========================
    // ACTIONS
    // =========================

    const toggleSave = useCallback(() => {
        if (!isAuthenticated) return;

        const userId = userResult.data.userId;

        const state = localDataService.getUserStateById(userId);
        const saved = state.savedCards ?? [];

        const updatedSaved = saved.includes(cardId)
            ? saved.filter((id) => id !== cardId)
            : [...saved, cardId];

        const updatedState = {
            ...state,
            savedCards: updatedSaved,
        };

        localDataService.writeUserState(
            userId,
            updatedState
        );

        setIsSaved(updatedSaved.includes(cardId));
    }, [userResult, cardId, isAuthenticated]);

    return {
        isSaved,
        toggleSave,
        isLoading,
        isAuthenticated
    };
};