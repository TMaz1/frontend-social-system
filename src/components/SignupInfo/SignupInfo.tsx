import React from "react";
import styles from "./SignupInfo.module.scss";
import { localDataService } from "../../services/localDataService";
import { useToast } from "../../context/ToastContext";


const SignupInfo: React.FC = () => {
    const { showToast } = useToast();

    const handleReset = () => {
        showToast("Demo data cleared. You're starting fresh.");
        localDataService.resetAll();
        window.location.reload(); // reload app to clean state
    };

    return (
        <div className={styles.info}>
            <h3>Try everything, risk-free</h3>

            <ul className={styles.points}>
                <li>Runs entirely in your browser</li>
                <li>No backend or external database</li>
                <li>Your data stays on your device</li>
            </ul>

            <p className={styles.description}>
                This is a front-end prototype built to simulate a real product
                experience. Any data you enter is stored locally in your browser
                using localStorage — it never leaves your device.
            </p>

            <p className={styles.subtle}>
                You can clear it anytime from your browser storage.
            </p>

            <button className={styles.resetBtn} onClick={handleReset}>
                Reset demo data
            </button>
        </div>
    );
};

export default SignupInfo;