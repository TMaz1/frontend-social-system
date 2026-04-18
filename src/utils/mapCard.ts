import type { Card } from "../services/localDataService";
import type { CardProps } from "../components/Card/Card";

export const mapCardToProps = (c: Card): CardProps => {
    const media = c.media?.[0];

    return {
        id: c.cardId,
        userId: c.userId,
        title: c.title,
        shortDescription: c.shortDescription ?? "",
        fullDescription: c.fullDescription ?? "",
        image: media?.url ?? "",
        imageWidth: media?.width,
        imageHeight: media?.height,
        link: c.link ?? "",
        hashtags: c.hashtags ?? [],
        collectionIds: [],
        createdAt: c.createdAt
            ? new Date(c.createdAt * 1000).toISOString()
            : "",
    };
};