import React, { useEffect, useState, useCallback } from "react";
import styles from "./ProfilePageContent.module.scss";

import ProfileHeader from "../../components/ProfileHeader/ProfileHeader";
import DraggableCardGrid from "../../components/DraggableCardGrid/DraggableCardGrid";
import NavbarCollections, { type CollectionTab } from "../../components/NavbarCollections/NavbarCollections";

import { type User } from "../../services/localDataService";
import CollectionModal from "../../components/AddToCollectionModal/CollectionModal";
import { useReorderContext } from "../../context/ReorderContext";
import { useUserCollections } from "../../hooks/collections/useUserCollections";
import InlineLoader from "../Loader/InlineLoader/InlineLoader";

interface Props {
    user: User;
    isOwnProfile: boolean;
}

const ProfilePageContent: React.FC<Props> = ({ user, isOwnProfile }) => {
    const {
        isLoading,
        collections,
        reorderCollections,
        deleteCollection,
        createCollection,
        updateCollection,
        getCollectionDescription,
    } = useUserCollections(user.userId, isOwnProfile);

    const [modalState, setModalState] = useState<null | {
        mode: "create" | "edit";
        collectionId?: string;
        initialTitle?: string;
        initialDescription?: string;
    }>(null);

    const [selectedCollection, setSelectedCollection] = useState("uploaded");
    const { reorderMode, beginReorder, endReorder, triggerExitModal } = useReorderContext();

    useEffect(() => {
        if (reorderMode) endReorder();
    }, [selectedCollection]);

    const currentDescription = isLoading ? "" : getCollectionDescription(selectedCollection);

    // =========================
    // HANDLERS
    // =========================
    const handleCollectionReorder = useCallback(
        (newOrder: CollectionTab[]) => {
            reorderCollections(newOrder);
        },
        [reorderCollections]
    );

    // only allow reordering collection for own account
    const requestCollectionReorder = () => {
        if (!isOwnProfile) return;
        beginReorder();
    };

    const handleCollectionDelete = (col: CollectionTab) => {
        deleteCollection(col.id);

        if (selectedCollection === col.id) {
            setSelectedCollection("uploaded");
        }
    };

    const handleCollectionAdd = () => {
        setModalState({ mode: "create" });
    };

    const handleEditCollection = (col: CollectionTab) => {
        setModalState({
            mode: "edit",
            collectionId: col.id,
            initialTitle: col.title ?? "",
            initialDescription: col.description ?? ""
        });
    };

    const handleModalConfirm = (title: string, description: string) => {
        if (!modalState) return;

        if (modalState.mode === "create") {
            createCollection(title, description);
        } else if (modalState.mode === "edit" && modalState.collectionId) {
            updateCollection(
                modalState.collectionId,
                title,
                description
            );
        }

        setModalState(null);
    };

    return (

        <div className={styles.container}>
            <ProfileHeader
                name={user.profileName ?? ""}
                bio={user.profileBio ?? ""}
                profileImage={user.profileImageUrl ?? ""}
                links={user.links ?? {}}
                share={`https://app.com/profile/${user.username}`}
                isOwnProfile={isOwnProfile}
            />

            {isLoading ? (
                <InlineLoader />
            ) : (
                <>
                    <div className={styles.navbarRow}>
                        <NavbarCollections
                            selected={selectedCollection}
                            onSelect={(newCol) => {
                                if (reorderMode) {
                                    triggerExitModal(() => setSelectedCollection(newCol));
                                } else {
                                    setSelectedCollection(newCol);
                                }
                            }}
                            collections={collections}
                            reorderMode={reorderMode && isOwnProfile}
                            onReorder={handleCollectionReorder}
                            onReorderRequest={requestCollectionReorder}
                            onDelete={(col) => {
                                if (!isOwnProfile) return;
                                if (col.id === "uploaded" || col.id === "saved") return;

                                handleCollectionDelete(col);
                            }}
                            onAddNew={handleCollectionAdd}
                            onEdit={handleEditCollection}
                            isOwnProfile={isOwnProfile}
                        />
                    </div>

                    {modalState && (
                        <CollectionModal
                            mode={modalState.mode}
                            initialTitle={modalState.initialTitle}
                            initialDescription={modalState.initialDescription}
                            onCancel={() => setModalState(null)}
                            onConfirm={handleModalConfirm}
                        />
                    )}



                    {selectedCollection !== "uploaded" && selectedCollection !== "saved" && (
                        <div className={styles.collectionHeaderRow}>
                            {currentDescription && (
                                <div className={styles.collectionDescription}>
                                    {currentDescription}
                                </div>
                            )}

                            {reorderMode && (
                                <button className={styles.doneBtn} onClick={endReorder}>
                                    Done
                                </button>
                            )}
                        </div>
                    )}

                    <DraggableCardGrid
                        userId={user.userId}
                        selectedCollection={selectedCollection}
                        isOwnProfile={isOwnProfile}
                    />
                </>
            )}
        </div>
    );
};

export default ProfilePageContent;