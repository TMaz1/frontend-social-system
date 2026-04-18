import React from "react";
import styles from "./EmptyStates.module.scss";
import { FiInbox } from "react-icons/fi";

interface Props {
    message: string;
    submessage?: string;
}

const NothingHere: React.FC<Props> = ({
    message,
    submessage = "Check back later"
}) => {
    return (
        <div className={styles.container}>
            <FiInbox className={styles.icon} />

            <h3 className={styles.title}>{message}</h3>

            {submessage && (
                <p className={styles.subtitle}>{submessage}</p>
            )}
        </div>
    );
};

export default NothingHere;