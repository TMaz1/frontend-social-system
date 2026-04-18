import React, { useState } from "react";
import styles from "./AuthForm.module.scss";
import { useToast } from "../../context/ToastContext";
import PasswordInput from "./PasswordInput";
import { Link } from "react-router-dom";
import { useUpdatePassword } from "../../hooks/profile/useUpdatePassword";
import { AuthStatus } from "../../types/asyncState";
import { useCurrentUsername } from "../../hooks/user/useCurrentUsername";

interface Props {
    onClose: () => void;
}

const ResetPasswordForm: React.FC<Props> = ({ onClose }) => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [saving, setSaving] = useState(false);

    const { showToast } = useToast();

    const result = useUpdatePassword();
    const username = useCurrentUsername();


    const handleSubmit = () => {
        if (result.status !== AuthStatus.Ready) return;

        setSaving(true);

        const res = result.data.updatePassword({
            oldPassword,
            newPassword,
            confirmPassword,
        });

        if (!res.success) {
            showToast(`${res.error} Please try again.` || "Something went wrong.");
            setSaving(false);
            return;
        }

        showToast(
            <>
                Password updated successfully!{" "}
                <Link to={`/profile/${username}`}>
                    View Profile
                </Link>
            </>
        );

        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");

        onClose();
        setSaving(false);
    };

    return (
        <div className={`${styles.authContainer} ${styles.modalAuthContainer}`}>
            <div className={styles.authForm}>
                <PasswordInput
                    label="Old password"
                    value={oldPassword}
                    onChange={setOldPassword}
                    show={showOld}
                    onToggle={() => setShowOld((prev) => !prev)}
                />

                <PasswordInput
                    label="New password"
                    value={newPassword}
                    onChange={setNewPassword}
                    show={showNew}
                    onToggle={() => setShowNew((prev) => !prev)}
                />

                <PasswordInput
                    label="Confirm new password"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    show={showConfirm}
                    onToggle={() => setShowConfirm((prev) => !prev)}
                />

                <div className={styles.buttonRow}>
                    <button
                        type="button"
                        className={styles.cancelBtn}
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        className={styles.confirmBtn}
                        disabled={saving}
                        onClick={handleSubmit}
                    >
                        {saving ? "Saving..." : "Update Password"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordForm;