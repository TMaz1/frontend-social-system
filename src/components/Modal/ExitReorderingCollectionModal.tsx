import React from "react";
import Modal from "./Modal";

interface Props {
    visible: boolean;
    onClose: () => void;
    onQuit: () => void;
}

const ExitReorderingCollectionModal: React.FC<Props> = ({ visible, onClose, onQuit }) => {
    return (
        <Modal
            visible={visible}
            title="Exit Reordering"
            content={
                <p>
                    Do you wish to quit reordering this collection? All your changes have been saved.
                </p>
            }
            onClose={onClose}
            buttons={[
                {
                    label: "CONTINUE",
                    variant: "primary",
                    onClick: onClose,
                },
                {
                    label: "QUIT",
                    onClick: onQuit,
                },
            ]}
        />
    );
};

export default ExitReorderingCollectionModal;