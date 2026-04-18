import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./EmptyStates.module.scss";
import { FiImage } from "react-icons/fi";

const NoAddedToCollection: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div
            className={styles.container}
            onClick={() => navigate("/")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "Enter") navigate("/");
            }}
        >
            <FiImage className={styles.icon} />

            <h3 className={styles.title}>No cards in this collection yet</h3>

            <p className={styles.subtitle}>
                Start adding images to build your collection
            </p>
        </div>
    );
};

export default NoAddedToCollection;