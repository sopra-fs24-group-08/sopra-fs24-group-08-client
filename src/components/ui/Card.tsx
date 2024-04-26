// Card.tsx
import React from "react";
import "../../styles/ui/Card.scss"; // 导入Card.scss

interface CardProps {
  id: number;
  name: string;
  points: number;
  color: string;
  src: string;
  onClick: () => void;
}

const Card: React.FC<CardProps> = ({ id, name, points, color, src, onClick }) => {

  return (
    <div
      key={id}
      className="card"
      onClick={onClick}
      style={{ "--card-color": color }}
    >
      <img
        src={src}
        style={{
          display: "block",
          width: "215%",
          height: "auto",
        }}
        alt=""
      />
      <div className="points">{points}</div>
    </div>
  );
};

export default Card;
