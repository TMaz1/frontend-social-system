import styles from "./CardGrid.module.scss";
import { useLayout } from "../../context/LayoutContext";

export type CardLayout = "grid" | "masonry" | "grid3x3" | "tall" | "landscape";

interface Props {
    children: React.ReactNode;
    layout?: CardLayout;
}

const CardGrid: React.FC<Props> = ({ children, layout: overrideLayout }) => {
    const { layout: contextLayout } = useLayout();
    const layout = overrideLayout ?? contextLayout;

    let gridClass = styles.grid; // default
    if (layout === "masonry") gridClass = styles.masonry;
    else if (layout === "grid3x3") gridClass = `${styles.grid} ${styles.grid3x3}`;
    else if (layout === "tall") gridClass = `${styles.grid} ${styles.tall}`;
    else if (layout === "landscape") gridClass = `${styles.grid} ${styles.landscape}`;

    return <div className={gridClass}>{children}</div>;
};

export default CardGrid;