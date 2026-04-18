import React, { useState, useEffect } from "react";
import Modal from "../Modal/Modal";
import styles from "./CollectionModal.module.scss";

interface Props {
    mode: "create" | "edit";
    initialTitle?: string;
    initialDescription?: string;
    onCancel: () => void;
    onConfirm: (title: string, description: string) => void;
}

const CollectionModal: React.FC<Props> = ({
    mode,
    initialTitle = "",
    initialDescription = "",
    onCancel,
    onConfirm
}) => {
    const [title, setTitle] = useState(initialTitle);
    const [description, setDescription] = useState(initialDescription);

    useEffect(() => {
        setTitle(initialTitle);
        setDescription(initialDescription);
    }, [mode, initialTitle, initialDescription]);

    return (
        <Modal
            visible={true}
            title={mode === "create" ? "Create Collection" : "Edit Collection"}
            onClose={onCancel}
            content={
                <div className={styles.form}>
                    <label className={styles.fieldLabel}>Title</label>
                    <input
                        className={styles.input}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <label className={styles.fieldLabel}>Description</label>
                    <textarea
                        className={styles.textarea}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
            }
            buttons={[
                {
                    label: "Cancel",
                    onClick: onCancel,
                    variant: "secondary"
                },
                {
                    label: mode === "create" ? "Create" : "Save",
                    onClick: () => onConfirm(title, description),
                    variant: "primary"
                }
            ]}
        />
    );
};

export default CollectionModal;