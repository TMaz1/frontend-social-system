import React from "react";
import type { CollectionTab } from "./NavbarCollections";
import styles from "./NavbarCollections.module.scss";

interface Props {
    collections: CollectionTab[];
    selected: string;
    onSelect: (id: string) => void;
    reorderMode: boolean;
}

const TabsRow: React.FC<Props> = ({
    collections,
    selected,
    onSelect,
    reorderMode
}) => {
    return (
        <div className={styles.row}>
            {collections.map(col => (
                <button
                    key={col.id}
                    className={`${styles.tab} ${selected === col.id ? styles.active : ""
                        }`}
                    disabled={reorderMode}
                    onClick={() => onSelect(col.id)}
                >
                    {col.title}
                </button>
            ))}
        </div>
    );
};

export default TabsRow;