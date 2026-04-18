import { useEffect, useState, useCallback } from "react";
import { localDataService } from "../../services/localDataService";
import type { CollectionTab } from "../../components/NavbarCollections/NavbarCollections";

type CollectionsData = {
    collections: CollectionTab[];

    reorderCollections: (newOrder: CollectionTab[]) => void;
    deleteCollection: (collectionId: string) => void;
    createCollection: (title: string, description: string) => void;
    updateCollection: (
        collectionId: string,
        title: string,
        description: string
    ) => void;

    getCollectionDescription: (collectionId: string) => string;
    isLoading: boolean;
};

export const useUserCollections = (userId: string, isOwnProfile: boolean): CollectionsData => {
    const [collections, setCollections] = useState<CollectionTab[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setIsLoading(true);

            await localDataService.init();

            const userCollections = localDataService.getAllCollectionsForUser(userId);

            const collectionTabs: CollectionTab[] =
                userCollections.map((c) => ({
                    id: c.collectionId,
                    title: c.title,
                    description: c.description,
                }));

            setCollections([
                { id: "uploaded", title: "Uploaded" },
                ...collectionTabs,
                { id: "saved", title: "Saved" },
            ]);

            setIsLoading(false);
        };

        load();
    }, [userId]);

    // =========================
    // MUTATIONS (OWN PROFILE ONLY)
    // =========================

    const reorderCollections = useCallback((newOrder: CollectionTab[]) => {
        if (!isOwnProfile) return;

        localDataService.saveCollectionOrder(
            userId,
            newOrder.map((c) => c.id)
        );

        setCollections(newOrder);
    },
        [userId, isOwnProfile]
    );

    const deleteCollection = useCallback((collectionId: string) => {
        if (!isOwnProfile) return;

        localDataService.deleteCollection(userId, collectionId);

        setCollections((prev) =>
            prev.filter((c) => c.id !== collectionId)
        );
    },
        [userId, isOwnProfile]
    );

    const createCollection = useCallback((title: string, description: string) => {
        if (!isOwnProfile) return;

        const newCol = localDataService.createCollection(userId, {
            title,
            description,
        });

        setCollections((prev) => {
            const withoutSaved = prev.filter(c => c.id !== "saved");

            return [
                ...withoutSaved,
                {
                    id: newCol.collectionId,
                    title: newCol.title,
                    description: newCol.description,
                },
                { id: "saved", title: "Saved" }
            ];
        });
    },
        [userId, isOwnProfile]
    );

    const updateCollection = useCallback((collectionId: string, title: string, description: string) => {
        if (!isOwnProfile) return;

        localDataService.updateCollection(userId, collectionId, {
            title,
            description,
        });

        setCollections((prev) =>
            prev.map((c) =>
                c.id === collectionId
                    ? { ...c, title, description }
                    : c
            )
        );
    },
        [userId, isOwnProfile]
    );

    // =========================
    // HELPERS
    // =========================

    const getCollectionDescription = useCallback((collectionId: string) => {
        if (collectionId === "uploaded" || collectionId === "saved")
            return "";

        const col = collections.find((c) => c.id === collectionId);
        return col?.description ?? "";
    },
        [collections]
    );

    return {
        isLoading,
        collections,
        reorderCollections,
        deleteCollection,
        createCollection,
        updateCollection,
        getCollectionDescription,
    };
};