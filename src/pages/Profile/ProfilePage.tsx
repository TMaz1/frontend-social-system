import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";

import styles from "../Profile/ProfilePage.module.scss"

import { AuthContext } from "../../context/AuthContext";
import { ReorderProvider } from "../../context/ReorderContext";
import ProfilePageContent from "../../components/ProfilePageContent/ProfilePageContent";

import { localDataService, type User } from "../../services/localDataService";
import InlineLoader from "../../components/Loader/InlineLoader/InlineLoader";

const ProfilePage: React.FC = () => {
    const { name } = useParams();
    const { userId: loggedInUserId } = useContext(AuthContext);

    const [profileUser, setProfileUser] = useState<User | null>(null);

    useEffect(() => {
        const loadUser = async () => {
            await localDataService.init();

            const found = localDataService
                .getUsers()
                .find(u => u.username === name);

            setProfileUser(found ?? null);
        };

        loadUser();
    }, [name]);

    if (!profileUser) {
        return (
            <div className={styles.page}>
                <div className={styles.container}>
                    <InlineLoader />
                </div>
            </div>
        );
    }

    const isOwnProfile = profileUser.userId === loggedInUserId;

    return (
        <div className={styles.page}>
            <ReorderProvider>
                <ProfilePageContent
                    user={profileUser}
                    isOwnProfile={isOwnProfile}
                />
            </ReorderProvider>
        </div>
    );
};

export default ProfilePage;