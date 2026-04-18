import { runMigrations } from "./migrations";

export const LOCAL_KEYS = {
    users: "app_users",
    userState: "app_user_state",
    cards: "app_cards",
    collections: "app_collections",
    layout: "app_profile_layouts"
};

export type SocialLinkType =
    | "website"
    | "instagram"
    | "youtube"
    | "twitter"
    | "tiktok"
    | "pinterest"
    | "twitch";

export type Links = Partial<Record<SocialLinkType, string>>;

export interface User {
    userId: string;
    username: string;
    email: string;
    password: string;
    profileName?: string;
    profileBio?: string;
    profileImageUrl?: string;
    links?: Links;
    updatedAt?: number;
}

export interface UserState {
    userId: string;
    collections?: string[];
    cardOrder?: Record<string, string[]>;
    savedCards?: string[];
}

interface CardMedia {
    type: "image" | "video";
    url: string;
    width?: number;
    height?: number;
}

export interface Card {
    cardId: string;
    userId: string;
    title: string;
    shortDescription?: string;
    fullDescription?: string;
    media?: CardMedia[];
    link?: string;
    hashtags?: string[];
    collectionId?: string;
    createdAt?: number;
}

export interface Collection {
    collectionId: string;
    userId: string;
    title: string;
    description?: string;
    createdAt?: number;
}

export type CardLayout =
    | "grid"
    | "grid3x3"
    | "masonry"
    | "tall"
    | "landscape";

export const DEFAULT_LAYOUT: CardLayout = "grid";

// ----------------------------------------------------------
// SERVICE
// ----------------------------------------------------------
export const localDataService = {
    // ------------------------------------------------------
    // INIT / SEEDING — ONLY RUNS ONCE
    // ------------------------------------------------------
    async init() {
        runMigrations();

        const hasUsers = localStorage.getItem(LOCAL_KEYS.users);
        const hasCards = localStorage.getItem(LOCAL_KEYS.cards);
        const hasCollections = localStorage.getItem(LOCAL_KEYS.collections);
        const hasUserState = localStorage.getItem(LOCAL_KEYS.userState);

        if (!hasUsers || !hasCards || !hasCollections || !hasUserState) {
            await this.seed();
        }
    },

    async seed() {
        const load = async (path: string) => {
            const res = await fetch(path);
            if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
            return JSON.parse(await res.text());
        };

        const base = import.meta.env.BASE_URL;

        const [rawUsers, rawState, rawCards, rawCollections] = await Promise.all([
            load(`${base}data/users.json`),
            load(`${base}data/userState.json`),
            load(`${base}data/cards.json`),
            load(`${base}data/collections.json`)
        ]);

        // Users
        const users: User[] = rawUsers.map((u: User) => ({
            ...u,
            links: u.links ?? {}
        }));

        // UserState
        const userState: UserState[] = rawState.map((s: UserState) => ({
            ...s,
            collections: s.collections ?? [],
            cardOrder: s.cardOrder ?? {}
        }));

        // Cards — ensure userIds follow same padded format if needed
        const cards: Card[] = rawCards.map((c: Card) => ({
            ...c,
            userId: normaliseUserId(c.userId)
        }));

        // Collections — title already exists now
        const collections: Collection[] = rawCollections.map((c: Collection) => ({
            ...c,
            userId: normaliseUserId(c.userId)
        }));

        // Save to storage
        localStorage.setItem(LOCAL_KEYS.users, JSON.stringify(users));
        localStorage.setItem(LOCAL_KEYS.userState, JSON.stringify(userState));
        localStorage.setItem(LOCAL_KEYS.cards, JSON.stringify(cards));
        localStorage.setItem(LOCAL_KEYS.collections, JSON.stringify(collections));
    },

    // ------------------------------------------------------
    // USERS
    // ------------------------------------------------------
    getUsers(): User[] {
        return JSON.parse(localStorage.getItem(LOCAL_KEYS.users) || "[]");
    },

    saveUsers(users: User[]) {
        localStorage.setItem(LOCAL_KEYS.users, JSON.stringify(users));
    },

    addUser(user: User) {
        const all = this.getUsers();
        all.push(user);
        this.saveUsers(all);
    },

    updateUser(userId: string, updated: User) {
        if (updated.userId !== userId) {
            throw new Error("Unauthorized");
        }

        const users = this.getUsers();
        const idx = users.findIndex(u => u.userId === updated.userId);
        if (idx === -1) return false;

        users[idx] = {
            ...users[idx],
            ...updated,
            links: {
                ...users[idx].links,
                ...(updated.links || {})
            },
            updatedAt: Math.floor(Date.now() / 1000)
        };

        this.saveUsers(users);
        return true;
    },

    updateUserLinks(userId: string, links: Record<string, string>) {
        const users = this.getUsers();
        const idx = users.findIndex(u => u.userId === userId);
        if (idx === -1) return;

        users[idx].links = {
            ...users[idx].links,
            ...links
        };

        this.saveUsers(users);
    },

    findUserByEmail(email: string) {
        return this.getUsers().find(
            u => u.email.toLowerCase() === email.toLowerCase()
        );
    },

    getUserById(userId: string) {
        return this.getUsers().find(u => u.userId === userId);
    },

    // ------------------------------------------------------
    // USER STATE
    // ------------------------------------------------------
    getUserState(): UserState[] {
        return JSON.parse(localStorage.getItem(LOCAL_KEYS.userState) || "[]");
    },

    getUserStateById(userId: string): UserState {
        const raw = this.getUserState().find((s) => s.userId === userId);
        return this.normaliseUserState(raw, userId);
    },

    saveUserState(states: UserState[]) {
        localStorage.setItem(LOCAL_KEYS.userState, JSON.stringify(states));
    },

    writeUserState(userId: string, state: UserState) {
        const all = this.getUserState();
        const normalized = this.normaliseUserState(state, userId);

        const idx = all.findIndex((s) => s.userId === userId);
        if (idx === -1) all.push(normalized);
        else all[idx] = normalized;

        this.saveUserState(all);
    },


    // ------------------------------------------------------
    // COLLECTIONS
    // ------------------------------------------------------
    getCollections(): Collection[] {
        return JSON.parse(localStorage.getItem(LOCAL_KEYS.collections) || "[]");
    },

    getCollectionsByUserId(userId: string): Collection[] {
        return this.getCollections().filter(c => c.userId === userId);
    },

    saveCollections(cols: Collection[]) {
        localStorage.setItem(LOCAL_KEYS.collections, JSON.stringify(cols));
    },

    createCollection(userId: string, data: { title: string; description?: string }) {
        const newCol: Collection = {
            collectionId: crypto.randomUUID(),
            userId,
            title: data.title,
            description: data.description ?? "",
            createdAt: Math.floor(Date.now() / 1000)
        };

        const all = this.getCollections();
        all.push(newCol);
        this.saveCollections(all);

        // update userState collection order
        const state =
            this.getUserStateById(userId) ??
            { userId, collections: [], cardOrder: {} };

        state.collections = [...(state.collections ?? []), newCol.collectionId];
        this.writeUserState(userId, state);

        return newCol;
    },

    updateCollection(userId: string, collectionId: string, updates: { title?: string; description?: string }) {
        const all = this.getCollections();
        const idx = all.findIndex(c => c.collectionId === collectionId);
        if (idx === -1) return;

        if (all[idx].userId !== userId) {
            throw new Error("Unauthorized");
        }

        all[idx] = { ...all[idx], ...updates };
        this.saveCollections(all);

        return all[idx];
    },

    deleteCollection(userId: string, collectionId: string) {
        const collections = this.getCollections();
        const col = collections.find(c => c.collectionId === collectionId);

        if (!col || col.userId !== userId) {
            throw new Error("Unauthorized");
        }

        this.saveCollections(collections.filter(c => c.collectionId !== collectionId));

        const states = this.getUserState();
        states.forEach(state => {
            if (state.userId !== userId) return; // limit scope

            state.collections = state.collections?.filter(id => id !== collectionId);
            if (state.cardOrder) delete state.cardOrder[collectionId];
        });

        this.saveUserState(states);
    },

    saveCollectionOrder(userId: string, newOrder: string[]) {
        const owned = this.getCollectionsByUserId(userId);
        const ownedIds = new Set(owned.map(c => c.collectionId));

        // SECURITY: validate ownership
        for (const id of newOrder) {
            if (!ownedIds.has(id)) {
                throw new Error("Unauthorized collection reorder");
            }
        }

        const state = this.getUserStateById(userId);
        if (!state) return false;
        state.collections = newOrder;

        this.writeUserState(userId, state);
        return true;
    },

    // ------------------------------------------------------
    // CARDS
    // ------------------------------------------------------
    getCards(): Card[] {
        return JSON.parse(localStorage.getItem(LOCAL_KEYS.cards) || "[]");
    },

    getCardsByUserId(userId: string): Card[] {
        return this.getCards().filter(c => c.userId === userId);
    },

    // saveCards(cards: Card[]) {
    //     localStorage.setItem(LOCAL_KEYS.cards, JSON.stringify(cards));
    // },

    // ------------------------------------------------------
    // CARD ORDER
    // ------------------------------------------------------
    saveCardOrder(userId: string, collectionId: string, newOrder: string[]) {
        const collection = this.getCollections().find(c => c.collectionId === collectionId);
        if (!collection || collection.userId !== userId) {
            throw new Error("Unauthorized");
        }

        const userCards = this.getCardsByUserId(userId);
        const validIds = new Set(userCards.map(c => c.cardId));

        // SECURITY
        for (const id of newOrder) {
            if (!validIds.has(id)) {
                throw new Error("Invalid card in reorder");
            }
        }

        const state = this.getUserStateById(userId);
        if (!state) return false;

        if (!state.cardOrder) state.cardOrder = {};
        state.cardOrder[collectionId] = newOrder;

        this.writeUserState(userId, state);
        return true;
    },

    getCardOrder(userId: string, collectionId: string): string[] {
        const collection = this.getCollections().find(c => c.collectionId === collectionId);

        if (!collection || collection.userId !== userId) {
            return [];
        }

        const s = this.getUserStateById(userId);
        return s?.cardOrder?.[collectionId] ?? [];
    },

    getSavedCardsByUserId(userId: string): Card[] {
        const state = this.getUserStateById(userId);
        if (!state?.savedCards?.length) return [];

        // const all = this.getCards(); // <-- all cards, not just userId
        // return all.filter(c => state.savedCards!.includes(c.cardId));

        const all = this.getCards();
        const allIds = new Set(all.map(c => c.cardId));

        return state.savedCards
            .filter(id => allIds.has(id)) // prevent invalid IDs
            .map(id => all.find(c => c.cardId === id)!)
    },

    // --------------------------
    // CARD HELPERS
    // --------------------------
    getUploadedCardsForUser(userId: string): Card[] {
        return this.getCardsByUserId(userId);
    },

    getSavedCardsForUser(userId: string): Card[] {
        const state = this.getUserStateById(userId);
        if (!state?.savedCards?.length) return [];
        const allCards = this.getCards();
        return allCards.filter(c => state.savedCards!.includes(c.cardId));
    },

    getCardsForCollection(userId: string, collectionId: string): Card[] {
        const collection = this.getCollections().find(c => c.collectionId === collectionId);

        // SECURITY: validate collection ownership
        if (!collection || collection.userId !== userId) {
            return [];
        }

        const cards = this.getCards();
        const userState = this.getUserStateById(userId);

        if (!userState?.cardOrder?.[collectionId]?.length) return [];

        return userState.cardOrder[collectionId]
            .map(id => cards.find(c => c.cardId === id))
            .filter((c): c is Card => !!c);
    },

    // ------------------------------------------------------
    // MERGED / ORDERED VIEW HELPERS
    // ------------------------------------------------------
    getAllCollectionsForUser(userId: string): Collection[] {
        const cols = this.getCollectionsByUserId(userId);
        const state = this.getUserStateById(userId);

        if (!state?.collections?.length) return cols;

        // Return in order userState specifies
        return state.collections
            .map(id => cols.find(c => c.collectionId === id))
            .filter((c): c is Collection => !!c && c.userId === userId);
    },

    getAllCardsForUser(userId: string): Card[] {
        const cards = this.getCardsByUserId(userId);
        const saved = this.getSavedCardsByUserId(userId);

        const map = new Map<string, Card>();
        [...cards, ...saved].forEach(c => map.set(c.cardId, c));

        return Array.from(map.values());
    },

    generateCollectionId() {
        return crypto.randomUUID();
    },

    normaliseUserState(state: UserState | undefined, userId: string): UserState {
        if (!state) {
            return {
                userId,
                collections: [],
                cardOrder: {},
                savedCards: [],
            };
        }
        return {
            userId: state.userId ?? userId,
            collections: state.collections ?? [],
            cardOrder: state.cardOrder ?? {},
            savedCards: state.savedCards ?? [],
        };
    },

    resetAll() {
        // const currentUserId = this.getCurrentUserId();

        // // optional: restrict to dev/admin
        // if (currentUserId !== "admin") {
        //     throw new Error("Unauthorized");
        // }

        Object.values(LOCAL_KEYS).forEach((key) => {
            localStorage.removeItem(key);
        });
    }
};

// ------------------------------------------------------
// INTERNAL UTILITIES
// ------------------------------------------------------
function normaliseUserId(id: string) {
    // Converts "user_001" → "user_000001"
    if (/^user_\d+$/.test(id)) {
        const number = id.split("_")[1];
        return `user_${number.padStart(6, "0")}`;
    }
    return id;
}