import React, { createContext, useContext, useEffect, useState } from "react";
import { localDataService, type Card } from "../services/localDataService";
import type { CardProps } from "../components/Card/Card";
import { mapCardToProps } from "../utils/mapCard";

interface CardContextType {
    cards: CardProps[];
    getCardById: (id: string) => CardProps | undefined;
    isInitialised: boolean;
}

const CardContext = createContext<CardContextType>({
    cards: [],
    getCardById: () => undefined,
    isInitialised: false
});

export const CardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cards, setCards] = useState<CardProps[]>([]);
    const [isInitialised, setIsInitialised] = useState(false);

    useEffect(() => {
        const load = async () => {
            await localDataService.init();

            const raw: Card[] = localDataService.getCards();

            setCards(raw.map(mapCardToProps));

            setIsInitialised(true); // controls loader
        };

        load();
    }, []);

    const getCardById = (id: string) => cards.find((c) => c.id === id);

    return (
        <CardContext.Provider value={{ cards, getCardById, isInitialised }}>
            {children}
        </CardContext.Provider>
    );
};

export const useCardContext = () => useContext(CardContext);