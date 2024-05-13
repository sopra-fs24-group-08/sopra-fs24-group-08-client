import React from "react";
import "../../styles/ui/Card.scss"; // 导入Card.scss

interface CardProps {
  id: number;
  name: string;
  points: number;
  color: string;
  src: string;
  onClick: () => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd?: (e: React.DragEvent<HTMLDivElement>) => void;
  draggable: boolean;
}

const Card: React.FC<CardProps> =
  ({ id,
     name,
     points,
     color,
     src,
     onClick,
     draggable,
     onDragStart,
     onDragEnd,
   }) => {

    return (
      <div
        key={id}
        className="card"
        onClick={onClick}
        style={{ backgroundColor: color, cursor: draggable ? "grab" : "pointer" }}
        draggable={draggable}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <img src={src} style={{
          display: "block",
          width: "225%",
          height: "auto",
        }} alt={`${name} card`} />
        <div className="points">{points}</div>
      </div>
    );
  };

export default Card;