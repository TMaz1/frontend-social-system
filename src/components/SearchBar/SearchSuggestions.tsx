import React from "react";
import type { CardProps } from "../../components/Card/Card";
import styles from "./SearchBar.module.scss";
import { useNavigate } from "react-router-dom";

interface Props {
    suggestions: CardProps[];
    query: string;
    activeIndex: number;
    setActiveIndex: (index: number) => void;
    setQuery: (query: string) => void;
    showSuggestions: boolean;
    setShowSuggestions: (show: boolean) => void;
    onCloseOverlay?: () => void;
}

const SearchSuggestions: React.FC<Props> = ({
    suggestions,
    query,
    activeIndex,
    setActiveIndex,
    setQuery,
    showSuggestions,
    setShowSuggestions,
    onCloseOverlay,
}) => {
    const navigate = useNavigate();

    // if (!query || suggestions.length === 0) return null;
    if (!query || suggestions.length === 0 || !showSuggestions) return null;


    const handleSelect = (card: CardProps) => {
        setQuery(card.title);
        setShowSuggestions(false); // Immediately hides dropdown
        setActiveIndex(-1);
        if (onCloseOverlay) onCloseOverlay();
        navigate(`/card/${card.id}`);
    };

    return (
        <div className={styles.suggestions}>
            {suggestions.map((card, i) => (
                <div
                    key={card.id}
                    className={`${styles.suggestionItem} ${activeIndex === i ? styles.active : ""}`}
                    onClick={() => handleSelect(card)}
                    onMouseDown={(e) => {
                        e.preventDefault(); // Important: prevents input blur/focus
                        handleSelect(card);
                    }}
                    onMouseEnter={() => setActiveIndex(i)}
                >
                    {card.title}
                </div>
            ))}
        </div>
    );
};

export default SearchSuggestions;