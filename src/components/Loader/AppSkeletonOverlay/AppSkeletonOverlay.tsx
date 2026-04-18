import React from "react";
import styles from "./AppSkeletonOverlay.module.scss";

const AppSkeletonOverlay: React.FC = () => {
    return (
        <div className={styles.overlay}>
            <div className={styles.navbar} />
            <div className={styles.content}></div>
            <div className={styles.shimmer} />
        </div>
    );
};

export default AppSkeletonOverlay;