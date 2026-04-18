import React, { useEffect } from "react";
import styles from "./SideMenu.module.scss";
import { FiX } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "../../config/routes";
import LayoutSwitcher from "../LayoutSwitcher/LayoutSwitcher";

interface Props {
    open: boolean;
    onClose: () => void;
}

const SideMenu: React.FC<Props> = ({ open, onClose }) => {
    const location = useLocation();

    const showLayout =
        location.pathname === "/" ||
        location.pathname.startsWith("/search") ||
        location.pathname.startsWith("/profile");;

    // lock scroll when menu is open
    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    // handle ESC key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        if (open) {
            window.addEventListener("keydown", handleEsc);
        }

        return () => {
            window.removeEventListener("keydown", handleEsc);
        };
    }, [open, onClose]);

    return (
        <div
            className={`${styles.root} ${open ? styles.open : ""}`}
            aria-hidden={!open}
        >
            {/* Overlay */}
            <div className={styles.overlay} onClick={onClose} />

            {/* Panel */}
            <aside className={styles.menu}>
                <button
                    className={styles.close}
                    onClick={onClose}
                    aria-label="Close menu"
                >
                    <FiX />
                </button>

                <nav className={styles.links}>
                    <Link to={ROUTES.HOME} onClick={onClose}>Home</Link>
                    <Link to={ROUTES.SEARCH} onClick={onClose}>Search</Link>
                </nav>

                {showLayout && (
                    <div className={styles.section}>
                        <div className={styles.sectionLabel}>View</div>
                        <LayoutSwitcher />
                    </div>
                )}
            </aside>
        </div>
    );
};

export default SideMenu;