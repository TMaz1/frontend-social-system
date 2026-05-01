import React, { useEffect, useState } from "react";
import styles from "./TopBanner.module.scss";
import { Link } from "react-router-dom";
import { FiX } from "react-icons/fi";
import { ROUTES } from "../../config/routes";

const STORAGE_KEY = "topBannerDismissed";

const TopBanner: React.FC = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const dismissed = sessionStorage.getItem(STORAGE_KEY);

        if (!dismissed) {
            setVisible(true);
        }
    }, []);

    const handleClose = () => {
        sessionStorage.setItem(STORAGE_KEY, "true");
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className={styles.banner}>
            <p>
                Front-end demo only — all data is stored locally in your browser. Nothing leaves your device.
                <Link
                    to={ROUTES.SIGNUP}
                    className={styles.link}
                    onClick={handleClose}
                >
                    Sign Up
                </Link>
            </p>

            <button className={styles.close} onClick={handleClose}>
                <FiX />
            </button>
        </div>
    );
};

export default TopBanner;