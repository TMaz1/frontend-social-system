import React from "react";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";

import {
    SortableContext,
    horizontalListSortingStrategy,
    arrayMove
} from "@dnd-kit/sortable";

import styles from "./NavbarCollections.module.scss";

import CollectionMenu from "./CollectionMenu";
import TabsRow from "./TabsRow";

export interface CollectionTab {
    id: string;
    title: string;
    description?: string;
}

interface NavbarCollectionsProps {
    collections: CollectionTab[];
    selected: string;
    onSelect: (id: string) => void;

    reorderMode: boolean;
    onReorder: (next: CollectionTab[]) => void;
    onReorderRequest: () => void;

    onDelete: (col: CollectionTab) => void;
    onAddNew: () => void;
    onEdit: (col: CollectionTab) => void;

    isOwnProfile: boolean;
}

const NavbarCollections: React.FC<NavbarCollectionsProps> = ({
    collections,
    selected,
    onSelect,
    reorderMode,
    onReorder,
    onReorderRequest,
    onDelete,
    onAddNew,
    onEdit,
    isOwnProfile
}) => {
    const sensors = useSensors(useSensor(PointerSensor));

    const handleDragEnd = (event: any) => {
        if (!reorderMode) return;

        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = collections.findIndex(c => c.id === active.id);
        const newIndex = collections.findIndex(c => c.id === over.id);

        if (oldIndex === -1 || newIndex === -1) return;

        onReorder(arrayMove(collections, oldIndex, newIndex));
    };

    const selectedCol = collections.find(c => c.id === selected) ?? null;

    return (
        <div className={styles.navbarWrapper}>

            <div className={styles.scrollArea}>
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={collections.map(c => c.id)}
                        strategy={horizontalListSortingStrategy}
                    >
                        <TabsRow
                            collections={collections}
                            selected={selected}
                            onSelect={onSelect}
                            reorderMode={reorderMode}
                        />
                    </SortableContext>
                </DndContext>
            </div>

            {selectedCol && isOwnProfile && (
                <div className={styles.menuContainer}>
                    <CollectionMenu
                        selectedCollection={selectedCol}
                        onReorderRequest={onReorderRequest}
                        onDelete={onDelete}
                        onAddNew={onAddNew}
                        onEdit={onEdit}
                    />
                </div>
            )}
        </div>
    );
};

export default NavbarCollections;