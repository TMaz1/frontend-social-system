import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Card.module.scss";

export interface CardProps {
    id: string;
    userId: string;
    title: string;
    shortDescription?: string;
    fullDescription?: string;
    image?: string;
    imageWidth?: number;
    imageHeight?: number;
    link?: string;
    hashtags?: string[];
    collectionIds?: string[];
    createdAt: string;
    reorderMode?: boolean;

    uploadedBy?: {
        userId: string;
        username: string;
        profileImageUrl?: string;
    };
}

function timeAgo(dateString: string) {
    const date = new Date(dateString);
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    const units: Record<string, number> = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
    };

    for (const [name, value] of Object.entries(units)) {
        const amount = Math.floor(seconds / value);
        if (amount >= 1) return `${amount} ${name}${amount > 1 ? "s" : ""} ago`;
    }

    return "Just now";
}

const Card: React.FC<CardProps> = ({ id, title, image = "", imageWidth, imageHeight, createdAt, reorderMode }) => {
    const navigate = useNavigate();
    const [loaded, setLoaded] = React.useState(false);

    const aspectRatio = imageWidth && imageHeight ? `${imageWidth} / ${imageHeight}` : undefined;

    const handleClick = () => {
        if (!reorderMode) {
            navigate(`/card/${id}`);
        }
    };

    return (
        <div
            className={`${styles.card} ${reorderMode ? styles.reorderMode : ""}`}
            onClick={handleClick}
            role="button"
            tabIndex={0}
        >
            {!image && <div className={styles.imagePlaceholder}></div>}

            {image && (
                <div
                    className={styles.imageContainer}
                    style={aspectRatio ? { aspectRatio } : undefined}
                >
                    {!loaded && (
                        <div
                            className={styles.imagePlaceholder}
                            style={aspectRatio ? { aspectRatio } : undefined}
                        />
                    )}

                    {image ? (
                        <img
                            className={`${styles.image} ${loaded ? styles.loaded : ""}`}
                            src={image || undefined}
                            alt={title}
                            loading="lazy"
                            decoding="async"
                            draggable={false}
                            onLoad={() => setLoaded(true)}
                        />
                    ) : null}
                </div>
            )}

            {reorderMode && <div className={styles.editOverlay} />}

            <div className={styles.overlay}>
                <div className={styles.title}>{title}</div>
                <div className={styles.time}>{timeAgo(createdAt)}</div>
            </div>

            {reorderMode && (
                <div title="Drag to reorder">
                    &#x2630;
                </div>
            )}
        </div>
    );
};

export default Card;