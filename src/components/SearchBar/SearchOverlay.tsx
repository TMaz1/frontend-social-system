import React, { useEffect } from "react";
import styles from "./SearchBar.module.scss";
import SearchBar from "../SearchBar/SearchBar";

interface Props {
    open: boolean;
    onClose: () => void;
}

const SearchOverlay: React.FC<Props> = ({ open, onClose }) => {
    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";
    }, [open]);

    if (!open) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.box} onClick={(e) => e.stopPropagation()}>
                <SearchBar overlay={true} onCloseOverlay={onClose} />
            </div>
        </div>
    );
};

export default SearchOverlay;