import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatComponent from '../ui/ChatComponent';
import BaseContainer from "../ui/BaseContainer";
import { Button } from "../ui/Button";
import { useGame } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';


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
  const { userId } = useAuth();
  const { sendMove, sendMessage ,gameId} = useGame();
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

  return (
      <BaseContainer>
        <div className="game-layout">
          <div className="left-column">
            <ChatComponent userId={userId} gameId={gameId} />
          </div>
          <div className="center-column">
            {/*{gameState && gameState.board.gridSquares.map((square, index) => (
                <div key={index} className={`grid-square color-${square.color}`}
                     onClick={() => placeCard(index)}>
                  {square.cardId ? `Card ID: ${square.cardId}` : 'Empty Slot'}
                </div>
            ))}*/}
          </div>
          <div className="right-column">
            <h1>Game ID: {gameId}</h1>
            <button onClick={() => handleMove({move: 'exampleMove'})}>Make Move</button>
            <button onClick={() => handleChat('Hello World!')}>Send Message</button>
            <Button onClick={() => handleCardAction("DRAW")}>Draw Card</Button>
            <Button onClick={() => navigate("/navigation")}>Exit</Button>
          </div>
        </div>
      </BaseContainer>
  );
};

export default KittyCards;
