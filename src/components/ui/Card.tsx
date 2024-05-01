import React from "react";
import "../../styles/ui/Card.scss"; // 导入Card.scss

interface CardProps {
  id: number;
  name: string;
  points: number;
  color: string;
  src: string;
  onClick: () => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd?: (e: React.DragEvent<HTMLDivElement>) => void;
}

const Card: React.FC<CardProps> = ({
  id,
  name,
  points,
  color,
  src,
  onClick,
  draggable = false,
  onDragStart,
  onDragEnd
}) => {

  return (
    <div
      key={id}
      className="card"
      onClick={onClick}
      style={{ "--card-color": color, cursor: draggable ? 'grab' : 'pointer' }}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <img
        src={src}
        alt={`${name} card`}
        style={{
          display: "block",
          width: "215%", 
          height: "auto",
        }}
      />
      <div className="points">{points}</div>
    </div>
  );
};

export default Card;
