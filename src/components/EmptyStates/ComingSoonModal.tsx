import React from "react";
import Modal from "../Modal/Modal";

interface Props {
    visible: boolean;
    onClose: () => void;
}

const ComingSoonModal: React.FC<Props> = ({ visible, onClose }) => {
    return (
        <Modal
            visible={visible}
            title="Coming Soon"
            content={
                <p>
                    This feature is currently being developed.
                    Feel free to explore the rest of the app!
                </p>
            }
            onClose={onClose}
            buttons={[
                {
                    label: "Got it",
                    variant: "primary",
                    onClick: onClose
                }
            ]}
        />
    );
};

export default ComingSoonModal;