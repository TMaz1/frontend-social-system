import { localDataService } from "./localDataService";

export const authService = {
    async loginLocal({ email, password }: { email: string; password: string }) {
        await localDataService.init();

        const user = localDataService.findUserByEmail(email);
        if (!user) return { success: false, message: "User not found!" };

        if (user.password !== password) {
            return { success: false, message: "Incorrect password" };
        }

        // Load cards
        const allCards = localDataService.getCardsByUserId(user.userId); // all cards created by user
        const savedCards = localDataService.getSavedCardsByUserId(user.userId); // cards saved in collections

        const token = btoa(`${user.userId}:${Date.now()}`);
        
        return {
            success: true,
            data: {
                token,
                user: {
                    userId: user.userId,
                    email: user.email,
                    username: user.username,
                    profileName: user.profileName,
                    profileBio: user.profileBio,
                    profileImageUrl: user.profileImageUrl,
                    links: user.links,
                },
                cards: {
                    allCards,
                    savedCards,
                },
            },
        };
    },

    async registerLocal({
        name,
        email,
        password,
    }: {
        name: string;
        email: string;
        password: string;
    }) {
        await localDataService.init();

        const existing = localDataService.findUserByEmail(email);
        if (existing) {
            return { success: false, message: "Email already registered" };
        }

        const username = name.toLowerCase().replace(/\s+/g, "_");

        const newUser = {
            userId: crypto.randomUUID(),
            email,
            username,
            password,
            profileName: name,
            profileBio: "",
            profileImageUrl: "",
            links: {},
        };

        localDataService.addUser(newUser);

        return {
            success: true,
            data: {
                userId: newUser.userId,
                username: newUser.username,
            },
        };
    },
};