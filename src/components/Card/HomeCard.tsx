import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Card, { type CardProps } from "../Card/Card";
import styles from "./Card.module.scss";
import AddToCollectionModal from "../AddToCollectionModal/AddToCollectionModal";
import { useSaveCard } from "../../hooks/cards/useSaveCard";
import { useAddCardToCollection } from "../../hooks/collections/useAddCardToCollection";

interface HomeCardProps extends Omit<CardProps, "collectionIds"> { }

interface HomeCardOptionalProps {
    reorderMode?: boolean;
}

const LONG_PRESS_TIME = 350;

const HomeCard: React.FC<HomeCardProps & HomeCardOptionalProps> = ({ id: cardId, reorderMode, ...props }) => {
    const navigate = useNavigate();

    const {
        isSaved,
        toggleSave,
        isAuthenticated: isSaveAuth,
    } = useSaveCard(cardId);

    const {
        collections,
        addCard,
        createCollection,
        isAuthenticated: isCollectionAuth,
    } = useAddCardToCollection(cardId);

    const isAuthenticated = isSaveAuth && isCollectionAuth;

    const [menuOpen, setMenuOpen] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const [collectionModalOpen, setCollectionModalOpen] = useState(false);

    const pressTimer = useRef<number | null>(null);
    const isPressing = useRef(false);
    const [suppressClick, setSuppressClick] = useState(false);

    const isMobile = window.innerWidth <= 1024;

    // -------------------------------
    // Long press handling (mobile/desktop)
    // -------------------------------
    const handlePressStart = (e: React.TouchEvent | React.MouseEvent) => {
        if (reorderMode || !isAuthenticated) return;

        isPressing.current = true;
        const touch = "touches" in e ? e.touches[0] : e;

        pressTimer.current = window.setTimeout(() => {
            if (isPressing.current) {
                setMenuOpen(true);
                setMenuPosition({ x: touch.clientX, y: touch.clientY });
                setSuppressClick(true);
            }
        }, LONG_PRESS_TIME);
    };

    const handlePressEnd = () => {
        isPressing.current = false;
        if (pressTimer.current) {
            clearTimeout(pressTimer.current);
            pressTimer.current = null;
        }
        setTimeout(() => setSuppressClick(false), 0); // reset click suppression
    };

    // -------------------------------
    // Menu actions
    // -------------------------------
    const handleAddToCollection = () => {
        setMenuOpen(false);
        setCollectionModalOpen(true);
    };

    const handleSelectCollection = (collectionId: string) => {
        addCard(collectionId);
        setCollectionModalOpen(false);
    };

    const handleCreateCollection = (title: string, description: string) => {
        const newId = createCollection(title, description);
        if (newId) setCollectionModalOpen(false);
    };

    return (
        <div
            className={styles.wrapper}
            onTouchStart={handlePressStart}
            onTouchEnd={handlePressEnd}
            onMouseDown={handlePressStart}
            onMouseUp={handlePressEnd}
            onClick={(e) => {
                if (e.button !== 0) return; // left click only
                if (!suppressClick && !reorderMode) {
                    navigate(`/card/${cardId}`);
                }
            }}

        >
            {/* Card */}
            <Card {...props} id={cardId} />

            {/* Quick Actions Menu */}
            {menuOpen && !isMobile && (
                <div
                    className={styles.menu}
                    style={{ top: menuPosition.y, left: menuPosition.x }}
                    onClick={() => setMenuOpen(false)}
                >
                    <button
                        className={styles.menuItem}
                        onClick={(e) => {
                            e.stopPropagation();

                            toggleSave();
                            setMenuOpen(false);
                        }}
                    >
                        {isSaved ? "Unsave" : "Save"}
                    </button>
                    <button
                        className={styles.menuItem}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCollection();
                        }}
                    >
                        Add to Collection
                    </button>
                </div>
            )}

            {/* Mobile Bottom Sheet Menu */}
            {menuOpen && isMobile && (
                <div className={styles.bottomSheet}>
                    <button
                        className={styles.menuItem}
                        onClick={() => {
                            toggleSave();
                            setMenuOpen(false);
                        }}
                    >
                        {isSaved ? "Unsave" : "Save"}
                    </button>
                    <button
                        className={styles.menuItem}
                        onClick={() => handleAddToCollection()}
                    >
                        Add to Collection
                    </button>
                    <button
                        className={styles.menuItemCancel}
                        onClick={() => setMenuOpen(false)}
                    >
                        Cancel
                    </button>
                </div>
            )}

            {/* Add to Collection Modal */}
            {collectionModalOpen && (
                <AddToCollectionModal
                    collections={collections}
                    onClose={() => setCollectionModalOpen(false)}
                    onSelectCollection={handleSelectCollection}
                    onCreateCollection={handleCreateCollection}
                />
            )}
        </div>
    );
};

export default HomeCard;