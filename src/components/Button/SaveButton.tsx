import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Button.module.scss";
import { useSaveCard } from "../../hooks/cards/useSaveCard";
import { useToast } from "../../context/ToastContext";
import { useCurrentUsername } from "../../hooks/user/useCurrentUsername";

interface Props {
    cardId: string;
}

export const SaveButton: React.FC<Props> = ({ cardId }) => {
    const {
        isSaved,
        toggleSave,
        isLoading,
        isAuthenticated
    } = useSaveCard(cardId);

    const { showToast } = useToast();
    const navigate = useNavigate();

    const username = useCurrentUsername();

    const handleClick = () => {
        // Not logged in → redirect
        if (!isAuthenticated) {
            showToast("Log in or create an account to save cards");
            navigate("/login");
            return;
        }

        toggleSave();

        // since toggleSave doesn't return anything, we infer next state manually
        showToast(
            <>
                {isSaved
                    ? "Card removed from 'Saved' collection"
                    : "Card added to 'Saved' collection"} {" "}
                <Link to={`/profile/${username}`}>
                    View Profile
                </Link>
            </>
        );
    };

    return (
        <button
            className={`${styles.saveBtn} ${isSaved ? styles.active : ""}`}
            onClick={handleClick}
        >
            {isLoading
                ? "☆ Save" // neutral default to prevent flicker
                : isSaved
                    ? "★ Saved"
                    : "☆ Save"}
        </button>
    );
};