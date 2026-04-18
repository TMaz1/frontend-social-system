import React, { useState } from "react";
import styles from "./EmptyStates.module.scss";
import { FiUpload } from "react-icons/fi";
import ComingSoonModal from "./ComingSoonModal";

const NoUploads: React.FC = () => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <div className={styles.container} onClick={() => setShowModal(true)}>
                <FiUpload className={styles.icon} />
                <h3 className={styles.title}>You haven't uploaded anything yet</h3>
                <p className={styles.subtitle}>Click here to upload your first item</p>
            </div>

            <ComingSoonModal
                visible={showModal}
                onClose={() => setShowModal(false)}
            />
        </>
    );
};

export default NoUploads;