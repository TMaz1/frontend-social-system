import React from "react";
import styles from "./InlineLoader.module.scss";

interface Props {
    height?: number | string; // optional override
}

const InlineLoader: React.FC<Props> = ({ height }) => {
    return (
        <div
            className={styles.wrapper}
            style={height ? { minHeight: height } : undefined}
        >
            <div className={styles.shimmer} />
        </div>
    );
};

export default InlineLoader;