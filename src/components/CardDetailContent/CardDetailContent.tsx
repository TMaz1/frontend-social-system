import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import styles from "./CardDetailContent.module.scss";
import type { CardProps } from "../Card/Card";
import { SaveButton } from "../Button/SaveButton";
import { AddToCollectionButton } from "../Button/AddToCollectionButton";
import { localDataService } from "../../services/localDataService";

interface Props {
    card: CardProps;
}

const CardDetailContent: React.FC<Props> = ({ card }) => {

    if (!card) return <div>Card not found</div>;

    const user = useMemo(() => {
        return localDataService.getUserById(card.userId);
    }, [card.userId]);

    const uploadedBy = user
        ? {
            userId: user.userId,
            username: user.username,
            profileImageUrl: user.profileImageUrl,
        }
        : undefined;

    return (
        <div className={styles.container}>

            {/* IMAGE */}
            <div className={styles.imageWrapper}>
                <img
                    src={card.image || undefined}
                    alt={card.title}
                    className={styles.image}
                />
            </div>

            {/* INFO PANEL */}
            <div className={styles.info}>

                {/* CREATOR */}
                {uploadedBy && (
                    <Link
                        to={`/profile/${uploadedBy.username}`}
                        className={styles.creator}
                    >
                        <img
                            src={uploadedBy.profileImageUrl || undefined}
                            alt={uploadedBy.username}
                            className={styles.creatorAvatar}
                        />
                        <span className={styles.creatorName}>
                            {uploadedBy.username}
                        </span>
                    </Link>
                )}

                <h1 className={styles.title}>{card.title}</h1>

                <p className={styles.description}>
                    {card.fullDescription}

                    {/* Inline link (editorial style) */}
                    {card.link && (
                        <>
                            {" "}
                            <a
                                href={card.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.inlineLink}
                            >
                                Visit →
                            </a>
                        </>
                    )}
                </p>

                <div className={styles.meta}>
                    <span className={styles.metaLabel}>Published:</span>
                    <span className={styles.metaValue}>
                        {new Date(card.createdAt).toLocaleDateString()}
                    </span>
                </div>

                <div className={styles.hashtags}>
                    {card.hashtags?.map((tag) => (
                        <span key={tag} className={styles.tag}>#{tag}</span>
                    ))}
                </div>

                <div className={styles.actionsRow}>
                    <SaveButton cardId={card.id} />
                    <AddToCollectionButton cardId={card.id} />
                </div>

            </div>
        </div>
    );
};

export default CardDetailContent;