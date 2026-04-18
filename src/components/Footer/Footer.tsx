import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiChevronUp } from "react-icons/fi";
import { useCurrentUsername } from "../../hooks/user/useCurrentUsername";

import styles from "./Footer.module.scss";
import { APP_CONFIG } from "../../config/appConfig";
import { ROUTES } from "../../config/routes";

const Footer: React.FC = () => {
    const [showTop, setShowTop] = useState(false);

    const username = useCurrentUsername();

    useEffect(() => {
        const onScroll = () => setShowTop(window.scrollY > 200);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer className={styles.footer}>
            <div className={styles.inner}>

                <div className={styles.grid}>

                    <section className={styles.column}>
                        <h3>Pages</h3>
                        <Link to={ROUTES.HOME}>Home</Link>
                        <Link to={ROUTES.SEARCH}>Search</Link>
                    </section>

                    <section className={styles.column}>
                        <h3>User</h3>
                        {username ?
                            (
                                <>
                                    <Link to={ROUTES.PROFILE(username)}>Account</Link>
                                    <Link to={ROUTES.PROFILE_SETTINGS}>Settings</Link>
                                </>
                            ) : (
                                <>
                                    <Link to={ROUTES.SIGNUP}>Sign Up</Link>
                                    <Link to={ROUTES.LOGIN}>Login</Link>
                                </>
                            )
                        }

                    </section>

                    <section className={styles.column}>
                        <h3>Social</h3>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
                        <a href="mailto:contact@example.com">Email</a>
                    </section>

                </div>

                <p className={styles.copy}>
                    {APP_CONFIG.getCopyright()}
                </p>
            </div>

            {showTop && (
                <button className={styles.backToTop} onClick={scrollToTop}>
                    <FiChevronUp />
                </button>
            )}
        </footer>
    );
};

export default Footer;