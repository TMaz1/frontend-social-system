import React, { useState } from "react";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
    type DragStartEvent,
    DragOverlay
} from "@dnd-kit/core";
import {
    SortableContext,
    arrayMove,
    rectSortingStrategy,
    verticalListSortingStrategy
} from "@dnd-kit/sortable";

import { useLayout } from "../../context/LayoutContext";
import { useReorderContext } from "../../context/ReorderContext";

import styles from "./DraggableCardGrid.module.scss";
import SortableCard from "./SortableCard";
import Card from "../Card/Card";
import CardGrid from "../CardGrid/CardGrid";
import NoUploads from "../EmptyStates/NoUploads";
import NoSaved from "../EmptyStates/NoSaved";
import NoAddedToCollection from "../EmptyStates/NoAddedToCollection";
import { EMPTY_STATE, useEmptyState } from "../../hooks/useEmptyState";
import NothingHere from "../EmptyStates/NothingHere";
import { useUserCards } from "../../hooks/cards/useUserCards";

interface Props {
    selectedCollection: string;
    isOwnProfile?: boolean;
}

const DraggableCardGrid: React.FC<Props> = ({ selectedCollection, isOwnProfile }) => {
    const { layout } = useLayout();
    const { reorderMode } = useReorderContext();

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
    );

    const effectiveLayout = reorderMode && layout === "masonry" ? "grid" : layout;
    const strategy = effectiveLayout === "masonry" ? verticalListSortingStrategy : rectSortingStrategy;
    const canReorder = reorderMode && selectedCollection !== "uploaded";

    const { cards, reorderCards } = useUserCards({ selectedCollection });
    const [activeId, setActiveId] = useState<string | null>(null);

    const activeCard = activeId ? cards.find(c => c.id === activeId) ?? null : null;

    const { isEmpty, type } = useEmptyState({
        cardsLength: cards.length,
        selectedCollection,
        isOwnProfile
    });

    const emptyStateMap = {
        [EMPTY_STATE.UPLOADS]: <NoUploads />,
        [EMPTY_STATE.SAVED]: <NoSaved />,
        [EMPTY_STATE.COLLECTION]: <NoAddedToCollection />,
        [EMPTY_STATE.OTHER_USER]: (
            <NothingHere
                message={
                    selectedCollection === "uploaded"
                        ? "No uploads yet"
                        : selectedCollection === "saved"
                            ? "No saved items"
                            : "Empty collection"
                }
            />
        )
    };

    // Drag handlers
    const onDragStart = (event: DragStartEvent) => {
        if (!reorderMode || !isOwnProfile) return;
        setActiveId(String(event.active.id));
    };

    const onDragEnd = (event: DragEndEvent) => {
        if (!reorderMode || !isOwnProfile) return;

        setActiveId(null);

        if (!event.over || event.active.id === event.over.id) return;
        if (selectedCollection === "uploaded") return;

        const oldIndex = cards.findIndex(c => c.id === String(event.active.id));
        const newIndex = cards.findIndex(c => c.id === String(event.over?.id));
        if (oldIndex === -1 || newIndex === -1) return;

        const nextOrder = arrayMove(cards, oldIndex, newIndex);

        // delegate to hook (handles state + persistence)
        reorderCards(nextOrder);
    };

    return (
        <div className={styles.gridWrapper}>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
            >
                {isEmpty ? (
                    type ? emptyStateMap[type] : null
                ) : (
                    <SortableContext
                        items={cards.map(c => c.id)}
                        strategy={strategy}
                    >
                        <CardGrid layout={effectiveLayout}>
                            {cards.map(card => (
                                <SortableCard
                                    key={card.id}
                                    card={card}
                                    disabled={!canReorder}
                                    reorderMode={canReorder}
                                />
                            ))}
                        </CardGrid>
                    </SortableContext>
                )}

                <DragOverlay>
                    {activeCard && (
                        <div className={styles.dragOverlay}>
                            <Card
                                {...activeCard}
                                reorderMode={canReorder}
                            />
                        </div>
                    )}
                </DragOverlay>
            </DndContext>
        </div>
    );

};

export default DraggableCardGrid;