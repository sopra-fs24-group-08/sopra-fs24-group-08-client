import React, { useContext } from "react";
import GameContext from "../context/GameContext";
import "../../styles/ui/RenderBoard.scss";
import repo from "../../images/repo.png";
import blue from "../../images/blue.png";
import green from "../../images/green.png";
import red from "../../images/red.png";
import white from "../../images/white.png";
import occupiedBlue from "../../images/occupiedBlue.png";
import occupiedGreen from "../../images/occupiedGreen.png";
import occupiedRed from "../../images/occupiedRed.png";
import occupiedWhite from "../../images/occupiedWhite.png";

const RenderBoard = () => {
  const { grid, handleCardDrop } = useContext(GameContext);

  // Function to determine the middle index based on any sequence of nine
  const findMiddleIndex = (id) => {
    const startId = Math.floor((id - 1) / 9) * 9 + 1; // Find the start ID of the current 9-block
    return startId + 4; // The middle index is always the fifth element in the set
  };

  const getImageSrc = (slot) => {
    const middleIndex = findMiddleIndex(slot.id);
    if (slot.id === middleIndex) {
      return repo; // Dedicated CardPile in the middle
    }
    if (!slot.color) {
      return "/images/white.png"; // Default for no color specified
    }
    const baseColor = slot.color.charAt(0).toUpperCase() + slot.color.slice(1);
    if (slot.occupied) {
      return `/images/occupied${baseColor}.png`;
    }
    return `/images/${baseColor.toLowerCase()}.png`;
  };

  return (
    <div className="game-board">
      {grid.map((slot) => (
        <div key={slot.id} className="game-board-slot"
             onDragOver={(e) => e.preventDefault()}
             onDrop={(e) => handleCardDrop(slot.id, e)}>
          <img src={getImageSrc(slot)} alt={`${slot.color || "Empty"} square`} />
        </div>
      ))}
    </div>
  );
};

export default RenderBoard;
