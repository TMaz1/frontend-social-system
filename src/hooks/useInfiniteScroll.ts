import { useEffect, useRef } from "react";

export const useInfiniteScroll = (callback: () => void) => {
    const loaderRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!loaderRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) callback();
            },
            { threshold: 1 }
        );

        observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [loaderRef.current]);

    return loaderRef;
};