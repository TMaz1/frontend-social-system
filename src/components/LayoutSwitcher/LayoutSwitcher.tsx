import styles from "./LayoutSwitcher.module.scss";
import { useLayout } from "../../context/LayoutContext";
import { Grid, Grid3x3, Masonry, Tall, Landscape } from "@custmaz/layout-icons";
import { type CardLayout } from "../../services/localDataService";

const ITEMS: { id: CardLayout; Icon: any }[] = [
    { id: "grid", Icon: Grid },
    { id: "grid3x3", Icon: Grid3x3 },
    { id: "masonry", Icon: Masonry },
    { id: "tall", Icon: Tall },
    { id: "landscape", Icon: Landscape },
];

export default function LayoutSwitcher() {
    const { layout, setLayout } = useLayout();

    return (
        <div className={styles.wrapper}>
            {ITEMS.map(({ id, Icon }) => {
                const active = layout === id;

                return (
                    <button
                        key={id}
                        onClick={() => setLayout(id)}
                        className={`${styles.btn} ${active ? styles.active : ""}`}
                        aria-label={`Layout ${id}`}
                    >
                        <Icon
                            variant={active ? "filled" : "outline"}
                            strokeWidth={1}
                            title={id}
                        />
                    </button>
                );
            })}
        </div>
    );
}