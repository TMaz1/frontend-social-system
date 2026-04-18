import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./EmptyStates.module.scss";
import { FiBookmark } from "react-icons/fi";

const NoSaved: React.FC = () => {
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
            <FiBookmark className={styles.icon} />

            <h3 className={styles.title}>No saved items yet</h3>

            <p className={styles.subtitle}>
                Tap to explore and save content
            </p>
        </div>
    );
};

export default NoSaved;