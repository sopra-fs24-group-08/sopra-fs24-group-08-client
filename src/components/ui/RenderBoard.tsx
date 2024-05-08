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
  const { grid, handleCardDrop, cardPileSize, drawCardMove } = useContext(GameContext);

  const imageMap = {
    blue: blue,
    green: green,
    red: red,
    white: white,
    occupiedBlue: occupiedBlue,
    occupiedGreen: occupiedGreen,
    occupiedRed: occupiedRed,
    occupiedWhite: occupiedWhite,
  };

  // Function to determine the middle index based on any sequence of nine
  const findMiddleIndex = (id) => {
    const startId = Math.floor((id - 1) / 9) * 9 + 1; // Find the start ID of the current 9-block

    return startId + 4; // The middle index is always the fifth element in the set
  };//Make simpler, store somewhere

  const getImageSrc = (slot) => {
    const middleIndex = findMiddleIndex(slot.id);
    if (slot.id === middleIndex) {

      return repo;  // Card pile in the middle
    }
    if (!slot.color) {

      return white; // Default for no color specified
    }

    const colorKey = slot.occupied ? `occupied${slot.color.charAt(0).toUpperCase()}${slot.color.slice(1).toLowerCase()}` : slot.color.toLowerCase();

    return imageMap[colorKey] || white; // Fallback to white if no match found
  };

  return (
    <div className="game-board">
      {grid.map((square) => (
        <div key={square.id} className="game-board-slot"
             onDragOver={(e) => e.preventDefault()}
             onDrop={(e) => handleCardDrop(e, square.id)}
             onClick={() => {
               // Make only the middle square clickable for drawing a card
               if (cardPileSize > 0 && findMiddleIndex(square.id) === square.id) {
                 console.log(square.id, square);
                 drawCardMove(4);
               }
             }}
             style={{
               cursor: (findMiddleIndex(square.id) === square.id && cardPileSize > 0) ? "pointer" : "default",
             }}>
          <img src={getImageSrc(square)} alt={`${square.color || "Empty"} square`} style={{
            display: "block",
            width: "100%",
            height: "100%",
          }} />
        </div>
      ))}
    </div>
  );
};


export default RenderBoard;
