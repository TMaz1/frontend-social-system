import React from "react";
import type { Links, SocialLinkType } from "../../services/localDataService";
import styles from "./ProfileEdit.module.scss";

interface Props {
    links: Links;
    setLinks: (l: Links) => void;
}

const SOCIAL_FIELDS: SocialLinkType[] = [
    "website",
    "instagram",
    "youtube",
    "twitter",
    "tiktok",
    "pinterest",
    "twitch",
];

const LABELS: Record<SocialLinkType, string> = {
    website: "Website",
    instagram: "Instagram",
    youtube: "YouTube",
    twitter: "Twitter / X",
    tiktok: "TikTok",
    pinterest: "Pinterest",
    twitch: "Twitch",
};

const SocialLinksEditor: React.FC<Props> = ({ links, setLinks }) => {
    const handleChange = (field: SocialLinkType, value: string) => {
        setLinks({
            ...links,
            [field]: value || undefined, // convert empty string to undefined
        });
    };

    return (
        <div className={styles.socialLinksContainer}>
            <h3 className={styles.sectionTitle}>Social Links</h3>
            {SOCIAL_FIELDS.map((field) => (
                <div key={field} className={styles.inputGroup}>
                    <label className={styles.inputLabel}>{LABELS[field]}</label>
                    <input
                        type="text"
                        value={links[field] ?? ""}
                        placeholder={`Enter ${LABELS[field]} link`}
                        className={styles.inputField}
                        onChange={(e) => handleChange(field, e.target.value)}
                    />
                </div>
            ))}
        </div>
    );
};

export default SocialLinksEditor;