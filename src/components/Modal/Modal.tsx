import React from "react";
import styles from "./Modal.module.scss";

interface ModalButton {
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary"; // primary = main, secondary = normal
}

interface ReusableModalProps {
    visible: boolean;
    title?: string;
    content?: React.ReactNode;
    buttons?: ModalButton[];
    onClose?: () => void;
    bottomSpacing?: boolean; // optional extra spacing at bottom
}

const Modal: React.FC<ReusableModalProps> = ({
    visible,
    title,
    content,
    buttons = [],
    onClose,
    bottomSpacing = true
}) => {
    if (!visible) return null;

    const renderButtons = () => {
        if (buttons.length === 1) {
            return (
                <div className={styles.singleButton}>
                    <button
                        className={buttons[0].variant === "primary" ? styles.confirmBtn : styles.cancelBtn}
                        onClick={buttons[0].onClick}
                    >
                        {buttons[0].label}
                    </button>
                </div>
            );
        }

        if (buttons.length === 2) {
            return (
                <div className={styles.twoButtons}>
                    <button
                        className={buttons[0].variant === "primary" ? styles.confirmBtn : styles.cancelBtn}
                        onClick={buttons[0].onClick}
                    >
                        {buttons[0].label}
                    </button>
                    <button
                        className={buttons[1].variant === "primary" ? styles.confirmBtn : styles.cancelBtn}
                        onClick={buttons[1].onClick}
                    >
                        {buttons[1].label}
                    </button>
                </div>
            );
        }

        if (buttons.length === 3) {
            return (
                <div className={styles.threeButtons}>
                    <button
                        className={buttons[0].variant === "primary" ? styles.confirmBtn : styles.cancelBtn}
                        onClick={buttons[0].onClick}
                    >
                        {buttons[0].label}
                    </button>
                    <div className={styles.rightButtons}>
                        <button
                            className={buttons[1].variant === "primary" ? styles.confirmBtn : styles.cancelBtn}
                            onClick={buttons[1].onClick}
                        >
                            {buttons[1].label}
                        </button>
                        <button
                            className={buttons[2].variant === "primary" ? styles.confirmBtn : styles.cancelBtn}
                            onClick={buttons[2].onClick}
                        >
                            {buttons[2].label}
                        </button>
                    </div>
                </div>
            );
        }

        return null;
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div
                className={`${styles.modal} ${bottomSpacing ? "" : styles.noBottomSpacing}`}
                onClick={(e) => e.stopPropagation()}
            >
                {title && <h2 className={styles.heading}>{title}</h2>}
                {content && <div className={styles.content}>{content}</div>}
                {buttons.length > 0 && <div className={styles.modalFooter}>{renderButtons()}</div>}
            </div>
        </div>
    );
};

export default Modal;