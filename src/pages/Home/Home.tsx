import React from "react";
import CardGrid from "../../components/CardGrid/CardGrid";
import { useCardContext } from "../../context/CardContext";
import HomeCard from "../../components/Card/HomeCard";

const Home: React.FC = () => {
    const { cards } = useCardContext();

    return (
        <div>
            <CardGrid>
                {cards.map((c) => (
                    <HomeCard key={c.id} {...c} />
                ))}
            </CardGrid>
        </div>
    );
};

export default Home;