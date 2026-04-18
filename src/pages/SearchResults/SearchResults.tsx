import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useCardContext } from "../../context/CardContext";
import CardGrid from "../../components/CardGrid/CardGrid";
import Card from "../../components/Card/Card";
import NoSearch from "../../components/EmptyStates/NoSearch";
import styles from "./SearchResults.module.scss";
import type { CardProps } from "../../components/Card/Card";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const SearchResults: React.FC = () => {
    const { cards } = useCardContext();
    const query = useQuery().get("q")?.toLowerCase() || "";

    // Show NoSearch if query is empty
    if (!query.trim()) {
        return <NoSearch />;
    }

    const results: CardProps[] = useMemo(() => {
        if (!query.trim()) return [];

        const exactTitle = cards.filter((c) =>
            c.title.toLowerCase().startsWith(query)
        );

        const partialTitle = cards.filter(
            (c) =>
                !exactTitle.includes(c) &&
                c.title.toLowerCase().includes(query)
        );

        const descMatches = cards.filter(
            (c) =>
                !exactTitle.includes(c) &&
                !partialTitle.includes(c) &&
                (
                    c.shortDescription?.toLowerCase().includes(query) ||
                    c.fullDescription?.toLowerCase().includes(query)
                )
        );

        const hashtagMatches = cards.filter(
            (c) =>
                !exactTitle.includes(c) &&
                !partialTitle.includes(c) &&
                !descMatches.includes(c) &&
                c.hashtags?.some((tag) => tag.toLowerCase().includes(query))
        );

        return [...exactTitle, ...partialTitle, ...descMatches, ...hashtagMatches];
    }, [cards, query]);

    return (
        <div className={styles.page}>
            <h2 className={styles.heading}>
                {results.length} result{results.length !== 1 ? "s" : ""} for "{query}"
            </h2>

            {results.length > 0 ? (
                <CardGrid>
                    {results.map((card) => (
                        <Card key={card.id} {...card} />
                    ))}
                </CardGrid>
            ) : (
                <p className={styles.noResults}>No cards found for "{query}".</p>
            )}
        </div>
    );
};

export default SearchResults;