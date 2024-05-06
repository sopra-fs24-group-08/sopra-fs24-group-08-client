import React, { useContext } from "react";
import Card from "components/ui/Card";
import GameContext from "../context/GameContext";
import "../../styles/ui/RenderHand.scss";


const RenderHand = () => {
  const { hand } = useContext(GameContext);

  const handleSelectCard = (card) => {
    console.log("Selected card:", card);
  };

  const handleDragStart = (event, card) => {
    event.dataTransfer.setData("text/plain", card.id.toString());
    console.log("Drag started for card:", card);
  };

  return (
    <div className="hand-of-cards">
      {hand.map((card) => (
        <Card
          key={card.id}
          id={card.id}
          name={card.name}
          points={card.points}
          color={card.color}
          src={`/path/to/images/${card.color.toLowerCase()}card.png`}
          onClick={() => handleSelectCard(card)}
          onDragStart={(e) => handleDragStart(e, card)}
          draggable={true}
        />
      ))}
    </div>
  );
};

export default RenderHand;
