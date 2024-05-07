import React, { useContext } from "react";
import GameContext from "../context/GameContext";
import "../../styles/ui/RenderBoard.scss";

const RenderBoard = () => {
  const { grid, handleCardDrop } = useContext(GameContext);

  // Function to determine the middle index based on any sequence of nine
  const findMiddleIndex = (id) => {
    const startId = Math.floor((id - 1) / 9) * 9 + 1; // Find the start ID of the current 9-block
    return startId + 4; // The middle index is always the fifth element in the set
  };

  return (
    <div className="game-board">
      {grid.map((slot) => {
        const middleIndex = findMiddleIndex(slot.id);
        return (
          <div key={slot.id} className="game-board-slot"
               onDragOver={(e) => e.preventDefault()}
               onDrop={(e) => handleCardDrop(slot.id, e)}>
            {slot.occupied ? (
              <img src={`/images/${slot.color.toLowerCase()}occupied.png`} alt={`${slot.color} occupied`} />
            ) : slot.id === middleIndex ? (
              <img src="/images/repo.png" alt="Card pile" /> // Dedicated CardPile in the middle
            ) : slot.color ? (
              <img src={`/images/${slot.color.toLowerCase()}.png`} alt={slot.color} />
            ) : (
              <div className="empty-slot">Empty</div>  // For slots without a specified color
            )}
          </div>
        );
      })}
    </div>
  );
};

export default RenderBoard;