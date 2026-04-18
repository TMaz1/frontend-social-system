import React, { useEffect, useState } from "react";
import type { User, Links } from "../../services/localDataService";
import styles from "./ProfileEdit.module.scss";

import SocialLinksEditor from "./SocialLinkEditor";
import ResetPasswordModal from "../AuthForm/ResetPasswordModal";
import ProfileAvatar from "../ProfileAvatar/ProfileAvatar";
import { useUserData } from "../../hooks/user/useUserData";
import { useUserProfileActions } from "../../hooks/profile/useUserProfileActions";
import { useToast } from "../../context/ToastContext";
import { AsyncStatus } from "../../types/asyncState";
import { Link } from "react-router-dom";
import { compressImage } from "../../utils/compressImage";

const BIO_MAX = 250;

const ProfileEdit: React.FC = () => {
    const userResult = useUserData();
    const actionResult = useUserProfileActions();
    const { showToast } = useToast();

    const [user, setUser] = useState<User | null>(null);

    // Editable fields
    const [profileName, setProfileName] = useState("");
    const [username, setUsername] = useState("");
    const [profileBio, setProfileBio] = useState("");
    const [links, setLinks] = useState<Links>({});
    const [avatar, setAvatar] = useState<string | null>(null);

    const [saving, setSaving] = useState(false);
    const [showResetPassword, setShowResetPassword] = useState(false);

    useEffect(() => {
        if (userResult.status !== AsyncStatus.Ready) return;

        const { user } = userResult.data;

        setUser(user);
        setProfileName(user.profileName ?? "");
        setUsername(user.username ?? "");
        setProfileBio(user.profileBio ?? "");
        setLinks(user.links ?? {});
        setAvatar(user.profileImageUrl ?? "");
    }, [userResult]);

    const handleImageUpload = async (file: File) => {
        const compressed = await compressImage(file);
        setAvatar(compressed);
    };

    const saveChanges = async () => {
        if (!user) return;

        if (actionResult.status !== AsyncStatus.Ready) {
            showToast("Not authenticated.");
            return;
        }

        setSaving(true);

        try {
            const updatedUser: User = {
                ...user,
                profileName,
                username,
                profileBio,
                profileImageUrl: avatar || undefined,
                links,
            };

            const result = actionResult.data.updateUser(updatedUser);

            if (!result.success) {
                showToast(result.error || "Failed to save profile. Please try again.");
                return;
            }

            showToast(
                <>
                    Profile updated successfully!{" "}
                    <Link to={`/profile/${username}`}>
                        View Profile
                    </Link>
                </>
            );
            setUser(updatedUser);
        } catch (err) {
            showToast(
                err instanceof Error
                    ? err.message
                    : "An unexpected error occurred. Please try again."
            );
        } finally {
            setSaving(false);
        }
    };

    if (userResult.status !== AsyncStatus.Ready) {
        return <div className={styles.loading}>Loading…</div>;
    }

    return (
        <div className={styles.authContainer}>
            <div className={styles.topBar}>
                <h2>Edit Profile</h2>
            </div>

            <form
                className={styles.authForm}
                onSubmit={(e) => {
                    e.preventDefault();
                    saveChanges();
                }}
            >
                <div className={styles.avatarEditContainer}>
                    <ProfileAvatar
                        src={avatar || undefined}
                        editable={true}
                        onUpload={handleImageUpload}
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label>Profile Name</label>
                    <input
                        type="text"
                        value={profileName}
                        placeholder="Enter your display name"
                        onChange={(e) => setProfileName(e.target.value)}
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label>Username</label>
                    <input
                        type="text"
                        value={username}
                        placeholder="Enter your username"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label>Bio</label>
                    <textarea
                        value={profileBio}
                        placeholder="Tell something about yourself"
                        rows={4}
                        maxLength={BIO_MAX}
                        onChange={(e) => setProfileBio(e.target.value)}
                    />
                    <div className={styles.charCounter}>
                        {profileBio.length}/{BIO_MAX}
                    </div>
                </div>

                <SocialLinksEditor links={links} setLinks={setLinks} />

                <button disabled={saving} type="submit">
                    {saving ? "Saving..." : "Save Changes"}
                </button>

                <div className={styles.passwordHint}>
                    Want to change your password?{" "}
                    <button
                        type="button"
                        className={styles.passwordLink}
                        onClick={() => setShowResetPassword(true)}
                    >
                        Reset it here
                    </button>
                </div>
            </form>

            {showResetPassword && (
                <ResetPasswordModal
                    visible={showResetPassword}
                    onClose={() => setShowResetPassword(false)}
                />
            )}
        </div>
    );
};

export default ProfileEdit;