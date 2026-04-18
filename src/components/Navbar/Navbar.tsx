import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.scss";
import { FiMenu, FiSearch, FiUser } from "react-icons/fi";
import SideMenu from "../SideMenu/SideMenu";
import SearchBar from "../SearchBar/SearchBar";
import LogoutButton from "../Button/LogoutButton";
import { AuthContext } from "../../context/AuthContext";
import SearchOverlay from "../SearchBar/SearchOverlay";
import LayoutSwitcher from "../LayoutSwitcher/LayoutSwitcher";
import { APP_CONFIG } from "../../config/appConfig";
import { ROUTES } from "../../config/routes";

const Navbar: React.FC = () => {
    const { userId, username } = useContext(AuthContext);

    const navigate = useNavigate();

    const [menuOpen, setMenuOpen] = useState(false);
    const [mobileSearch, setMobileSearch] = useState(false);
    const [isShrunk, setIsShrunk] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);

    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    /* ---- Resize Handling ---- */
    useEffect(() => {
        const handleResize = () => {
            const nowMobile = window.innerWidth <= 900;
            setIsMobile(nowMobile);
            if (!nowMobile) setMobileSearch(false);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    /* ---- Shrink on scroll ---- */
    useEffect(() => {
        const handleScroll = () => setIsShrunk(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    /* ---- Close dropdown when clicking outside ---- */
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    /* Profile Icon Click */
    const handleProfileClick = () => {
        if (!userId) {
            navigate("/signup");
            return;
        }
        setShowDropdown(prev => !prev); // toggle open/close
    };

    return (
        <>
            <nav className={`${styles.navbar} ${isShrunk ? styles.shrunk : ""}`}>
                <Link to={ROUTES.HOME} className={styles.logo}>{APP_CONFIG.logo}</Link>

                <div className={styles.centerLinks}>
                    <LayoutSwitcher />
                </div>

                <div className={styles.right}>
                    {!isMobile && <SearchBar mobile={false} />}

                    {isMobile && (
                        <button
                            className={styles.searchBtn}
                            onClick={() => setMobileSearch(true)}
                        >
                            <FiSearch />
                        </button>
                    )}

                    {/* PROFILE ICON + DROPDOWN */}
                    <div className={styles.profileWrapper} ref={dropdownRef}>
                        <div className={styles.profileIcon} onClick={handleProfileClick}>
                            <FiUser />
                        </div>

                        {userId && showDropdown && (
                            <div className={styles.dropdown}>
                                <Link
                                    to={username ? ROUTES.PROFILE(username) : ROUTES.HOME}
                                    onClick={() => setShowDropdown(false)}
                                >
                                    Account
                                </Link>
                                <Link to={ROUTES.PROFILE_SETTINGS} onClick={() => setShowDropdown(false)}>Settings</Link>

                                <LogoutButton />
                            </div>
                        )}
                    </div>

                    <button className={styles.burger} onClick={() => setMenuOpen(true)}>
                        <FiMenu />
                    </button>
                </div>
            </nav>

            <SearchOverlay open={mobileSearch} onClose={() => setMobileSearch(false)} />
            <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
        </>
    );
};

export default Navbar;