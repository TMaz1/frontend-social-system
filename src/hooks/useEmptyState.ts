export const EMPTY_STATE = {
    UPLOADS: "uploads",
    SAVED: "saved",
    COLLECTION: "collection",
    OTHER_USER: "otherUser"
} as const;

export type EmptyStateType =
    typeof EMPTY_STATE[keyof typeof EMPTY_STATE] | null;

interface Params {
    cardsLength: number;
    selectedCollection: string;
    isOwnProfile?: boolean;
}

export const useEmptyState = ({
    cardsLength,
    selectedCollection,
    isOwnProfile
}: Params) => {
    const isEmpty = cardsLength === 0;

    if (!isEmpty) {
        return { isEmpty: false, type: null as EmptyStateType };
    }

    if (isOwnProfile) {
        if (selectedCollection === "uploaded") {
            return { isEmpty: true, type: EMPTY_STATE.UPLOADS };
        }

        if (selectedCollection === "saved") {
            return { isEmpty: true, type: EMPTY_STATE.SAVED };
        }

        return { isEmpty: true, type: EMPTY_STATE.COLLECTION };
    }

    return { isEmpty: true, type: EMPTY_STATE.OTHER_USER };
};