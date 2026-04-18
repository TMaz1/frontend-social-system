import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCardContext } from "../../context/CardContext";
import CardDetailContent from "../../components/CardDetailContent/CardDetailContent";
import styles from "./CardDetail.module.scss";

const CardDetail: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getCardById } = useCardContext();

    const card = getCardById(id!);

    if (!card) return <div className={styles.notFound}>Card not found.</div>;

    return (
        <div className={styles.page}>
            <button className={styles.back} onClick={() => navigate(-1)}>
                ← Back
            </button>

            <CardDetailContent card={card} />
        </div>
    );
};

export default CardDetail;