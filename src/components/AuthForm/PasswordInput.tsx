import React from "react";
import { FiLock, FiUnlock } from "react-icons/fi";
import styles from "./AuthForm.module.scss";

interface Props {
    label: string;
    value: string;
    onChange: (value: string) => void;
    show: boolean;
    onToggle: () => void;
    placeholder?: string;
}

const PasswordInput: React.FC<Props> = ({
    label,
    value,
    onChange,
    show,
    onToggle,
    placeholder
}) => {
    return (
        <div className={styles.passwordWrapper}>
            <input
                type={show ? "text" : "password"}
                placeholder={placeholder || label}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />

            <span className={styles.hideIcon} onClick={onToggle}>
                {show ? <FiUnlock /> : <FiLock />}
            </span>
        </div>
    );
};

export default PasswordInput;