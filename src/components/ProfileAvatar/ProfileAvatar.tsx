import React from "react";
import { FiEdit2, FiUpload } from "react-icons/fi";
import styles from "./ProfileAvatar.module.scss";
import { Link } from "react-router-dom";

interface Props {
    src?: string;
    editable?: boolean;

    // view mode
    editLink?: string;

    // edit mode
    onUpload?: (file: File) => void;
}

const ProfileAvatar: React.FC<Props> = ({
    src,
    editable = false,
    editLink,
    onUpload
}) => {
    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !onUpload) return;
        onUpload(file);
    };

    return (
        <div className={styles.avatarContainer}>
            <div className={styles.avatarWrapper}>
                <img src={src || undefined} className={styles.avatar} />
            </div>


            {editable && (
                <>
                    {editLink ? (
                        <Link to={editLink} className={styles.editBadge}>
                            <FiEdit2 />
                        </Link>
                    ) : (
                        <label className={styles.editBadge}>
                            <FiUpload />
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={handleFile}
                            />
                        </label>
                    )}
                </>
            )}
        </div>
    );
};

export default ProfileAvatar;