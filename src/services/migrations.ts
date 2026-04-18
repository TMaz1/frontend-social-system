import { LOCAL_KEYS } from "./localDataService";

const MIGRATION_KEY = "app_schema_version";
const CURRENT_VERSION = 2;

/**
 * Runs once on startup before init().
 * Ensures old/broken localStorage structures are upgraded.
 */
export function runMigrations() {
    const version = Number(localStorage.getItem(MIGRATION_KEY) || "0");

    if (version >= CURRENT_VERSION) {
        return; // Already migrated
    }

    console.log("%cRunning profile app migrations…", "color:#0bf; font-weight:bold");

    try {
        // Run version-specific steps
        if (version < 1) migrateFromLegacySchema();
        if (version < 2) migrateUserIdPadding();

        localStorage.setItem(MIGRATION_KEY, String(CURRENT_VERSION));
        console.log("%cMigration complete", "color:#0b0; font-weight:bold");
    } catch (err) {
        console.error("Migration failed!", err);
        console.warn("Resetting localStorage to fresh seed…");

        // wipe everything rather than crash the app
        localStorage.clear();
        localStorage.setItem(MIGRATION_KEY, String(CURRENT_VERSION));
    }
}

/**
 * Migration #1
 * Fix legacy collection format: { name: "Portraits" } → { title: "Portraits" }
 */
function migrateFromLegacySchema() {
    const collectionsRaw = localStorage.getItem(LOCAL_KEYS.collections);
    if (!collectionsRaw) return;

    let cols = JSON.parse(collectionsRaw);

    let changed = false;

    cols = cols.map((c: any) => {
        if (c.name && !c.title) {
            c.title = c.name;
            delete c.name;
            changed = true;
        }
        return c;
    });

    if (changed) {
        console.log("Migrated legacy collections → title property");
        localStorage.setItem(LOCAL_KEYS.collections, JSON.stringify(cols));
    }
}

/**
 * Migration #2
 * Fix old userIds such as user_001 → user_000001
 */
function migrateUserIdPadding() {
    const fix = (id: string) =>
        /^user_\d+$/.test(id)
            ? `user_${id.split("_")[1].padStart(6, "0")}`
            : id;

    const migrate = (key: string) => {
        const raw = localStorage.getItem(key);
        if (!raw) return;

        const arr = JSON.parse(raw);
        let changed = false;

        const updated = arr.map((item: any) => {
            if (item.userId) {
                const newId = fix(item.userId);
                if (newId !== item.userId) {
                    item.userId = newId;
                    changed = true;
                }
            }
            return item;
        });

        if (changed) {
            console.log(`Padded userId in ${key}`);
            localStorage.setItem(key, JSON.stringify(updated));
        }
    };

    migrate(LOCAL_KEYS.users);
    migrate(LOCAL_KEYS.cards);
    migrate(LOCAL_KEYS.collections);
    migrate(LOCAL_KEYS.userState);
}