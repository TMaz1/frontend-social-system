import React from "react";
import { FiInstagram, FiYoutube, FiTwitter, FiShare2, FiGlobe } from "react-icons/fi";
import { FaTiktok, FaPinterestP, FaTwitch } from "react-icons/fa";

import styles from "./SocialMediaLinks.module.scss";
import type { Links } from "../../services/localDataService";

interface Props {
    links: Links;
    share?: string;
}

const iconMap = {
    instagram: <FiInstagram />,
    youtube: <FiYoutube />,
    twitter: <FiTwitter />,
    tiktok: <FaTiktok />,
    pinterest: <FaPinterestP />,
    twitch: <FaTwitch />,
    website: <FiGlobe />
} as const;

const SocialMediaLinks: React.FC<Props> = ({ links, share }) => {
    const platforms = Object.keys(iconMap) as Array<keyof typeof iconMap>;

    const normaliseUrl = (url: string) => {
        if (!url) return "";

        // If already absolute, return as-is
        if (/^https?:\/\//i.test(url)) {
            return url;
        }

        // Otherwise, prepend https://
        return `https://${url}`;
    };

    return (
        <div className={styles.socials}>
            {platforms.map((platform) => {
                const url = links[platform];

                if (url) {
                    return (
                        <a
                            key={platform}
                            href={normaliseUrl(url)}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {iconMap[platform]}
                        </a>
                    );
                }
                return null;
            })}

            {share && (
                <a href={share} target="_blank" rel="noopener noreferrer">
                    <FiShare2 />
                </a>
            )}
        </div>
    );
};

export default SocialMediaLinks;