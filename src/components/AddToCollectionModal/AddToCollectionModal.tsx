import React, { useState } from "react";
import Modal from "../Modal/Modal";
import styles from "./CollectionModal.module.scss";
import CollectionModal from "./CollectionModal";
import type { UserCollection } from "../../hooks/collections/useAddCardToCollection";

interface Props {
    collections: UserCollection[];
    onClose: () => void;
    onSelectCollection: (collectionId: string) => void;
    onCreateCollection: (title: string, description: string) => void;
}

const AddToCollectionModal: React.FC<Props> = ({
    collections,
    onClose,
    onSelectCollection,
    onCreateCollection,
}) => {
    const [showCreateModal, setShowCreateModal] = useState(false);

    const handleAdd = (collectionId: string) => {
        onSelectCollection(collectionId);
        onClose();
    };

    const handleCreateConfirm = (title: string, description: string) => {
        onCreateCollection(title, description);
        setShowCreateModal(false);
    };

    return (
        <>
            <Modal
                visible={true}
                title="Add to Collection"
                onClose={onClose}
                content={
                    <div
                        className={ `${styles.contentWrapper} ${styles.centered}`}
                    >
                        <div className={styles.list}>
                            {collections.map((c) => (
                                <button
                                    key={c.collectionId}
                                    className={styles.collectionButton}
                                    onClick={() => handleAdd(c.collectionId)}
                                >
                                    <div className={styles.colTitle}>{c.title}</div>
                                    <div className={styles.colDesc}>{c.description}</div>
                                </button>
                            ))}
                        </div>

                        <button
                            className={styles.createBtn}
                            onClick={() => setShowCreateModal(true)}
                        >
                            + Create New Collection
                        </button>
                    </div>
                }
            />

            {showCreateModal && (
                <CollectionModal
                    mode="create"
                    onCancel={() => setShowCreateModal(false)}
                    onConfirm={handleCreateConfirm}
                />
            )}
        </>
    );
};

export default AddToCollectionModal;