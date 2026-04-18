import React, { useState } from "react";
import styles from "./ProfileHeader.module.scss";
import SocialMediaLinks from "../ProfileLinks/SocialMediaLinks";
import type { Links } from "../../services/localDataService";
import { Link } from "react-router-dom";
import ComingSoonModal from "../EmptyStates/ComingSoonModal";
import ProfileAvatar from "../ProfileAvatar/ProfileAvatar";

interface Props {
    name: string;
    bio: string;
    profileImage: string;
    links: Links;
    share?: string;
    isOwnProfile: boolean;
}

const ProfileHeader: React.FC<Props> = ({
    name,
    bio,
    profileImage,
    links,
    share,
    isOwnProfile
}) => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <div className={styles.header}>
                <ProfileAvatar
                    src={profileImage || undefined}
                    editable={isOwnProfile}
                    editLink="/profile/settings"
                />

                <div className={styles.text}>
                    <h1 className={styles.title}>{name}</h1>
                    <p className={styles.bio}>{bio}</p>
                </div>

                <div className={styles.buttons}>
                    {isOwnProfile ? (
                        <Link to="/profile/settings" className={styles.addBtn}>
                            EDIT PROFILE
                        </Link>
                    ) : (
                        <button
                            className={styles.addBtn}
                            onClick={() => setShowModal(true)}
                        >
                            FOLLOW
                        </button>
                    )}
                </div>

                <SocialMediaLinks links={links} share={share} />
            </div>
            <ComingSoonModal
                visible={showModal}
                onClose={() => setShowModal(false)}
            />
        </>
    );
};

export default ProfileHeader;