import React from "react";
import Modal from "../Modal/Modal";
import ResetPasswordForm from "./ResetPasswordForm";

interface Props {
    visible: boolean;
    onClose: () => void;
}

const ResetPasswordModal: React.FC<Props> = ({ visible, onClose }) => {
    return (
        <Modal
            visible={visible}
            title="Reset Password"
            onClose={onClose}
            content={
                <ResetPasswordForm onClose={onClose} />
            }
            bottomSpacing={false}
        />
    );
};

export default ResetPasswordModal;