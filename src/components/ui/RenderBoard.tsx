import React, { useContext } from "react";
import GameContext from "../context/GameContext";
import "../../styles/ui/RenderBoard.scss";


const RenderBoard = () => {
  const { grid, handleCardDrop } = useContext(GameContext);

  return (
    <div className="game-board">
      {grid.map((slot) => (
        <div key={slot.id} className="game-board-slot"
             onDragOver={(e) => e.preventDefault()}
             onDrop={(e) => handleCardDrop(slot.id, e)}>
          {slot.occupied ? (
            <img src={`/path/to/images/${slot.color}occupied.png`} alt={`${slot.color} occupied`} />
          ) : (
            <div className="empty-slot">Empty</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default RenderBoard;
