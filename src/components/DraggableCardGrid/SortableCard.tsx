import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Card, { type CardProps } from "../Card/Card";

interface SortableCardProps {
    card: CardProps;
    disabled?: boolean;
    reorderMode: boolean;
}

const SortableCard: React.FC<SortableCardProps> = ({ card, disabled, reorderMode }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: card.id,
        disabled
    });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition: transition ?? "transform 200ms ease",
        opacity: isDragging ? 0.4 : 1,
        cursor: disabled ? "default" : "grab",
        width: "100%",
        height: "100%"
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...(!disabled ? listeners : {})}
        >
            <Card {...card} reorderMode={reorderMode && !disabled} />
        </div>
    );
};

export default SortableCard;