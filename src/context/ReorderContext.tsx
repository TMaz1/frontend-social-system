// src/context/ReorderContext.tsx
import React, { createContext, useContext, useState, useCallback } from "react";

interface ReorderContextType {
    reorderMode: boolean;
    beginReorder: () => void;
    endReorder: () => void;
    triggerExitModal: (callback: () => void) => void;
}

const ReorderContext = createContext<ReorderContextType | undefined>(undefined);

export const useReorderContext = () => {
    const ctx = useContext(ReorderContext);
    if (!ctx) throw new Error("useReorderContext must be used inside ReorderProvider");
    return ctx;
};

export const ReorderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [reorderMode, setReorderMode] = useState(false);
    const [exitCallback, setExitCallback] = useState<() => void>(() => () => { });
    const [showExitModal, setShowExitModal] = useState(false);

    const beginReorder = useCallback(() => setReorderMode(true), []);
    const endReorder = useCallback(() => setReorderMode(false), []);

    const triggerExitModal = useCallback((callback: () => void) => {
        if (reorderMode) {
            setExitCallback(() => callback);
            setShowExitModal(true);
        } else {
            callback();
        }
    }, [reorderMode]);

    const handleQuit = () => {
        setShowExitModal(false);
        exitCallback();
        setExitCallback(() => () => { });
        endReorder();
    };

    const handleContinue = () => setShowExitModal(false);

    return (
        <ReorderContext.Provider value={{ reorderMode, beginReorder, endReorder, triggerExitModal }}>
            {children}
            {showExitModal && (
                <div className="exit-reorder-modal-overlay">
                    <div className="exit-reorder-modal">
                        <h3>Exit Reordering</h3>
                        <p>All your changes have been saved. Do you wish to quit reordering this collection?</p>
                        <button onClick={handleContinue}>CONTINUE</button>
                        <button onClick={handleQuit}>QUIT</button>
                    </div>
                </div>
            )}
        </ReorderContext.Provider>
    );
};