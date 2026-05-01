import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { CollectionTab } from "./NavbarCollections";
import styles from "./NavbarCollections.module.scss";

interface Props {
    selectedCollection: CollectionTab;
    onReorderRequest: () => void;
    onDelete: (col: CollectionTab) => void;
    onAddNew: () => void;
    onEdit: (col: CollectionTab) => void;
}

const OFFSET = 8;

const CollectionMenu: React.FC<Props> = ({
    selectedCollection,
    onReorderRequest,
    onDelete,
    onAddNew,
    onEdit
}) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });

    const btnRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const isSystemCollection =
        selectedCollection.id === "uploaded" ||
        selectedCollection.id === "saved";

    /* Positioning */
    const updatePosition = () => {
        if (!btnRef.current || !menuRef.current) return;

        const btnRect = btnRef.current.getBoundingClientRect();
        const menuRect = menuRef.current.getBoundingClientRect();

        const scrollY = window.scrollY;
        const scrollX = window.scrollX;

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const menuWidth = menuRect.width;
        const isMobile = viewportWidth < 700;

        let top = btnRect.bottom + scrollY + OFFSET;
        let left;

        if (isMobile) {
            // ALWAYS open to the left on mobile
            left = btnRect.right + scrollX - menuWidth;
        } else {
            // desktop smart positioning
            left = btnRect.right + scrollX - menuWidth;

            if (left + menuWidth > scrollX + viewportWidth - 8) {
                left = btnRect.left + scrollX;
            }
        }

        // clamp horizontally
        left = Math.max(
            scrollX + 8,
            Math.min(left, scrollX + viewportWidth - menuWidth - 8)
        );

        // vertical logic (unchanged)
        if (top + menuRect.height > scrollY + viewportHeight - 8) {
            top = btnRect.top + scrollY - menuRect.height - OFFSET;
        }
        if (top < scrollY + 8) top = scrollY + 8;

        setCoords({ top, left });
    };

    useEffect(() => {
        if (!menuOpen) return;
        requestAnimationFrame(updatePosition);
    }, [menuOpen]);

    useEffect(() => {
        if (!menuOpen) return;

        const reposition = () => updatePosition();
        window.addEventListener("resize", reposition);
        window.addEventListener("scroll", reposition, true);

        return () => {
            window.removeEventListener("resize", reposition);
            window.removeEventListener("scroll", reposition, true);
        };
    }, [menuOpen]);

    useEffect(() => {
        const close = (e: MouseEvent) => {
            if (
                menuRef.current?.contains(e.target as Node) ||
                btnRef.current?.contains(e.target as Node)
            ) return;

            setMenuOpen(false);
        };

        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, []);

    return (
        <>
            <button
                ref={btnRef}
                className={styles.icon}
                onClick={() => setMenuOpen(o => !o)}
            >
                ⋯
            </button>

            {menuOpen &&
                createPortal(
                    <div
                        ref={menuRef}
                        className={styles.menuPortal}
                        style={{
                            position: "absolute",
                            top: coords.top,
                            left: coords.left
                        }}
                    >
                        {/* Reorder */}
                        {!isSystemCollection && (
                            <button
                                onClick={() => {
                                    setMenuOpen(false);
                                    onReorderRequest();
                                }}
                            >
                                Reorder Collection
                            </button>
                        )}

                        {/* Edit */}
                        {!isSystemCollection && (
                            <button
                                onClick={() => {
                                    setMenuOpen(false);
                                    onEdit(selectedCollection);
                                }}
                            >
                                Edit Collection
                            </button>
                        )}

                        {/* Delete */}
                        {!isSystemCollection && (
                            <button
                                onClick={() => {
                                    setMenuOpen(false);
                                    onDelete(selectedCollection);
                                }}
                            >
                                Delete Collection
                            </button>
                        )}

                        {/* Always available */}
                        <button
                            onClick={() => {
                                setMenuOpen(false);
                                onAddNew();
                            }}
                        >
                            Add New Collection
                        </button>
                    </div>,
                    document.body
                )}
        </>
    );
};

export default CollectionMenu;