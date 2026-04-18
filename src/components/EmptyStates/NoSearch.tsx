import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./EmptyStates.module.scss";
import { FiSearch } from "react-icons/fi";

const NoSearch: React.FC = () => {
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
            <FiSearch className={styles.icon} />

            <h3 className={styles.title}>Ready to Explore?</h3>
            
            <p className={styles.subtitle}>
                Type something in the search bar to find cards
            </p>
        </div>
    );
};

export default NoSearch;