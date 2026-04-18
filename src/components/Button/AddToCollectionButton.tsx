import React, { useState } from "react";
import styles from "./Button.module.scss";
import AddToCollectionModal from "../AddToCollectionModal/AddToCollectionModal";
import { useAddCardToCollection } from "../../hooks/collections/useAddCardToCollection";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import { useCurrentUsername } from "../../hooks/user/useCurrentUsername";

interface Props {
    cardId: string;
}

export const AddToCollectionButton: React.FC<Props> = ({ cardId }) => {
    const [open, setOpen] = useState(false);
    const { showToast } = useToast();

    const navigate = useNavigate();
    const username = useCurrentUsername();

    const {
        collections,
        addCard,
        createCollection,
        isLoading,
        isAuthenticated,
    } = useAddCardToCollection(cardId);


    const handleOpen = () => {
        if (!isAuthenticated) {
            showToast("Log in or create an account to save cards");
            navigate("/login");
            return;
        }

        if (isLoading) return;

        setOpen(true);
    };

    const handleSelectCollection = (collectionId: string) => {
        addCard(collectionId);

        showToast(
            <>
                Card successfully added to collection!{" "}
                <Link to={`/profile/${username}`}>
                    View Profile
                </Link>
            </>
        );

        setOpen(false);
    };

    const handleCreateCollection = (title: string, description: string) => {
        const newId = createCollection(title, description);

        if (newId) {
            showToast(
                <>
                    Card added to new collection!{" "}
                    <Link to={`/profile/${username}`}>
                        View Profile
                    </Link>
                </>
            );

            setOpen(false);
        }
    };

    return (
        <>
            <button className={styles.addBtn} onClick={handleOpen}>
                + Add to Collection
            </button>

            {open && (
                <AddToCollectionModal
                    collections={collections}
                    onClose={() => setOpen(false)}
                    onSelectCollection={handleSelectCollection}
                    onCreateCollection={handleCreateCollection}
                />
            )}
        </>
    );
};