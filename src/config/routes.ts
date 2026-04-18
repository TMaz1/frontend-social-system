export const ROUTES = {
    HOME: "/",
    SIGNUP: "/signup",
    LOGIN: "/login",
    PROFILE: (name: string) => `/profile/${name}`,
    PROFILE_SETTINGS: "/profile/settings",
    CARD_DETAIL: (id: string | number) => `/card/${id}`,
    SEARCH: "/search",
};