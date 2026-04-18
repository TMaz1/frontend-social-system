import React, { useState, useEffect, useRef, useMemo } from "react";
import { useCardContext } from "../../context/CardContext";
import styles from "./SearchBar.module.scss";
import { FiSearch, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import type { CardProps } from "../../components/Card/Card";
import SearchSuggestions from "./SearchSuggestions";
import { useLocation } from "react-router-dom";


interface Props {
    mobile?: boolean;
    overlay?: boolean;
    onCloseOverlay?: () => void;
}

const SearchBar: React.FC<Props> = ({ mobile, overlay, onCloseOverlay }) => {
    const { cards } = useCardContext();
    const navigate = useNavigate();
    const location = useLocation();

    const [expanded, setExpanded] = useState(!mobile || !!overlay);
    const [query, setQuery] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [, setUserNavigated] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setExpanded(!mobile || !!overlay);

        // only clear if NOT on search page
        if (!location.pathname.startsWith("/search")) {
            setQuery("");
        }

        setShowSuggestions(false);
        setActiveIndex(-1);
        setUserNavigated(false);
    }, [mobile, overlay, location.pathname]);

    // Close suggestions on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (!wrapperRef.current?.contains(e.target as Node)) {
                setShowSuggestions(false);
                setActiveIndex(-1);
                setUserNavigated(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Filter suggestions by title
    const filteredSuggestions: CardProps[] = useMemo(() => {
        if (!query.trim()) return [];
        const lower = query.toLowerCase();
        const startsWith = cards.filter((c) =>
            c.title.toLowerCase().startsWith(lower)
        );
        const includes = cards.filter(
            (c) => !startsWith.includes(c) && c.title.toLowerCase().includes(lower)
        );
        return [...startsWith, ...includes].slice(0, 8);
    }, [query, cards]);

    const clearSearch = () => {
        setQuery("");
        setShowSuggestions(false);
        setActiveIndex(-1);
        setUserNavigated(false);

        inputRef.current?.blur();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const lastIndex = filteredSuggestions.length - 1;

        if (e.key === "Escape") {
            setShowSuggestions(false);
            setActiveIndex(-1);
            setUserNavigated(false);
            return;
        }

        if (e.key === "ArrowDown" && filteredSuggestions.length > 0) {
            setUserNavigated(true);
            setActiveIndex((prev) => (prev >= lastIndex ? -1 : prev + 1));
            return;
        }

        if (e.key === "ArrowUp" && filteredSuggestions.length > 0) {
            setUserNavigated(true);
            setActiveIndex((prev) => (prev <= -1 ? lastIndex : prev - 1));
            return;
        }

        if (e.key === "Enter") {
            if (activeIndex !== -1) {
                const selected = filteredSuggestions[activeIndex];
                setQuery(selected.title);
                setShowSuggestions(false);
                setActiveIndex(-1);
                setUserNavigated(false);

                (e.target as HTMLInputElement).blur();
                if (onCloseOverlay) onCloseOverlay();

                navigate(`/card/${selected.id}`);
            } else if (query.trim()) {
                // Go to search results page
                setShowSuggestions(false);
                setActiveIndex(-1);
                setUserNavigated(false);

                inputRef.current?.blur();

                if (onCloseOverlay) onCloseOverlay();
                navigate(`/search?q=${encodeURIComponent(query.trim())}`);
            }
        }
    };

    const wrapperClass = overlay
        ? `${styles.wrapper} ${styles.expanded} ${styles.desktop}`
        : `${styles.wrapper} ${expanded ? styles.expanded : ""} ${mobile ? styles.mobile : styles.desktop}`;

    return (
        <div ref={wrapperRef} className={wrapperClass}>
            <FiSearch className={styles.searchIcon} />
            <input
                type="text"
                ref={inputRef}
                value={query}
                placeholder="Search cards..."
                className={styles.input}
                autoFocus={overlay || (mobile && expanded)}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setShowSuggestions(true);
                    setActiveIndex(-1);
                    setUserNavigated(false);
                    if (mobile && !expanded) setExpanded(true);
                }}
                onKeyDown={handleKeyDown}
            />
            {query && (
                <button className={styles.closeBtn} onClick={clearSearch}>
                    <FiX />
                </button>
            )}

            <SearchSuggestions
                suggestions={filteredSuggestions}
                query={query}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                setQuery={setQuery}
                setShowSuggestions={setShowSuggestions}
                showSuggestions={showSuggestions}
                onCloseOverlay={onCloseOverlay}
            />
        </div>
    );
};

export default SearchBar;