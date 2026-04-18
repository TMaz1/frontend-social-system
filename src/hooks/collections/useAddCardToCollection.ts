import { useEffect, useState, useCallback } from "react";
import { localDataService } from "../../services/localDataService";
import { useUserData } from "../user/useUserData";
import { AuthStatus } from "../../types/asyncState";

export interface UserCollection {
    collectionId: string;
    title: string;
    description?: string;
}

type AddCardData = {
    collections: UserCollection[];
    addCard: (collectionId: string) => void;
    createCollection: (title: string, description: string) => string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
};

export const useAddCardToCollection = (cardId: string): AddCardData => {
    const userResult = useUserData();

    const [collections, setCollections] = useState<UserCollection[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const isAuthenticated = userResult.status === AuthStatus.Ready;

    // =========================
    // LOAD COLLECTIONS
    // =========================
    useEffect(() => {
        if (!isAuthenticated) {
            setCollections([]);
            setIsLoading(false);
            return;
        }

        const load = async () => {
            setIsLoading(true);

            await localDataService.init();

            const raw =
                localDataService.getCollectionsByUserId(
                    userResult.data.userId
                ) ?? [];

            setCollections(
                raw.map((c) => ({
                    collectionId: c.collectionId,
                    title: c.title,
                    description: c.description ?? "",
                }))
            );

            setIsLoading(false);
        };

        load();
    }, [userResult, isAuthenticated]);

    const addCard = useCallback((collectionId: string) => {
        if (!isAuthenticated) return;

        const userId = userResult.data.userId;
        const state = localDataService.getUserStateById(userId);

        const existingOrder = state.cardOrder?.[collectionId] ?? [];

        if (existingOrder.includes(cardId)) return;

        const updatedState = {
            ...state,
            cardOrder: {
                ...state.cardOrder,
                [collectionId]: [
                    ...existingOrder,
                    cardId,
                ],
            },
        };

        localDataService.writeUserState(
            userId,
            updatedState
        );
    },
        [userResult, cardId, isAuthenticated]
    );

    const createCollection = useCallback((title: string, description: string) => {
        if (!isAuthenticated) return null;
        const userId = userResult.data.userId;

        const newCol = localDataService.createCollection(userId, {
            title,
            description,
        });

        const state = localDataService.getUserStateById(userId);

        const updated = {
            ...state,
            cardOrder: {
                ...state.cardOrder,
                [newCol.collectionId]: [cardId],
            },
        };

        localDataService.writeUserState(
            userId,
            updated
        );

        // refresh collections
        const updatedList = localDataService.getCollectionsByUserId(userId) ?? [];

        setCollections(
            updatedList.map((c) => ({
                collectionId: c.collectionId,
                title: c.title,
                description: c.description ?? "",
            }))
        );

        return newCol.collectionId;
    },
        [userResult, cardId, isAuthenticated]
    );

    return {
        collections,
        addCard,
        createCollection,
        isLoading,
        isAuthenticated,
    };
};