import { useEffect, useState, useCallback } from "react";
import { localDataService } from "../../services/localDataService";
import type { CardProps } from "../../components/Card/Card";
import { useUserData } from "../user/useUserData";
import { AuthStatus } from "../../types/asyncState";
import { mapCardToProps } from "../../utils/mapCard";

interface Params {
    selectedCollection: string;
}

export const useUserCards = ({ selectedCollection }: Params) => {
    const userResult = useUserData();
    
    const userId =
        userResult.status === AuthStatus.Ready
            ? userResult.data.userId
            : null;

    const [cards, setCards] = useState<CardProps[]>([]);

    // =========================
    // LOAD CARDS
    // =========================
    useEffect(() => {
        if (!userId) return;

        let loadedCards: any[] = [];

        if (selectedCollection === "uploaded") {
            loadedCards = localDataService.getCardsByUserId(userId);
        } else if (selectedCollection === "saved") {
            loadedCards = localDataService.getSavedCardsByUserId(userId);
        } else {
            loadedCards = localDataService.getCardsForCollection(userId, selectedCollection);
        }

        setCards(loadedCards.map(mapCardToProps));
    }, [userId, selectedCollection]);

    // =========================
    // REORDER
    // =========================
    const reorderCards = useCallback(
        (nextOrder: CardProps[]) => {
            setCards(nextOrder);

            if (!userId) return;
            if (selectedCollection === "uploaded") return;

            localDataService.saveCardOrder(
                userId,
                selectedCollection,
                nextOrder.map(c => c.id)
            );
        },
        [userId, selectedCollection]
    );

    return {
        cards,
        reorderCards
    };
};