import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatComponent from '../ui/ChatComponent';
import BaseContainer from "../ui/BaseContainer";
import { Button } from "../ui/Button";
import { useGame } from '../context/GameContext';

interface Card {
  id: number;
  color: string;
  points: number;
}

interface GameState {
  board: {
    gridSquares: Array<{ id: number, cardId: number | null, color: string }>
  },
  players: Array<{ id: number, cards: Card[] }>
}

interface KittyCardsProps {
  gameId: number;
  userId: number;
}

const KittyCards = () => {
  const { sendMove, sendMessage, gameId } = useGame();
  const navigate = useNavigate();
  //const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);


  const handleCardAction = (moveType: string, cardId?: number, position?: number) => {
      sendMove(`/game/${gameId}/move`, { move: moveType, cardId, position ,});
    }
  //Base structure, add logic
  const handleMove = (move) => {
    sendMove(move);
  };

  const handleChat = (message) => {
    sendMessage({ text: message });
  };

  const placeCard = (position) => {
    if (!selectedCardId) {
      alert("Please select a card first.");
      return;
    }
    handleCardAction("PLACE", selectedCardId, position);
    setSelectedCardId(null);
  };

  const selectCard = (cardId: number) => {
    setSelectedCardId(cardId);
  };

  if (!gameId) return <div>Waiting for the game to start!</div>;

  return ( <div> OKAY</div>
  );
};

export default KittyCards;
