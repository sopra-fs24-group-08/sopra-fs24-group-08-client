import React, { useContext } from "react";
import Card from "components/ui/Card";
import GameContext from "../context/GameContext";
import "../../styles/ui/RenderHand.scss";
import bluecard from "../../images/bluecard.png";
import redcard from "../../images/redcard.png";
import greencard from "../../images/greencard.png";
import whitecard from "../../images/whitecard.png";

const cardImageMap = {
  Blue: bluecard,
  Red: redcard,
  Green: greencard,
  White: whitecard,
};


const RenderHand = () => {
  const { hand, handleCardDrop } = useContext(GameContext);

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
          name={card.color + " Card"}
          points={card.points}
          color={card.color}
          src={cardImageMap[card.color.charAt(0).toUpperCase() + card.color.slice(1)] || cardImageMap["White"]}
          style={{
            display: "block",
            width: "80%",
            height: "auto",
          }} // Default to white if no matching image
          onClick={() => console.log("Selected card:", card)}
          onDragStart={(e) => handleDragStart(e, card)}
          draggable={true}
        />
      ))}
    </div>
  );
};

export default RenderHand;