import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { connect, subscribe, send, disconnect } from '../../helpers/webSocket';
import ChatComponent from '../ui/ChatComponent';
import BaseContainer from "../ui/BaseContainer";
import { Button } from "../ui/Button";

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

const KittyCards = ({ gameId, userId }: KittyCardsProps) => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  //stompClient.subscribe('/topic/gamestate', function (message) {
    //console.log(JSON.parse(message.body).content);
  useEffect(() => {
    connect(() => {
      setIsConnected(true);
      subscribe(`/topic/game/${gameId}`, (newGameState) => {
        setGameState(JSON.parse(newGameState.body));
      });
    });

    return () => {
      disconnect();
      setIsConnected(false);
    };
  }, [gameId]);

  const handleCardAction = (moveType: string, cardId?: number, position?: number) => {
    if (isConnected) {
      send(`/game/${gameId}/move`, { move: moveType, cardId, position ,});
    }
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

  return (
      <BaseContainer>
        <div className="game-layout">
          <div className="left-column">
            <ChatComponent userId={userId} gameId={gameId} />
          </div>
          <div className="center-column">
            {gameState && gameState.board.gridSquares.map((square, index) => (
                <div key={index} className={`grid-square color-${square.color}`}
                     onClick={() => placeCard(index)}>
                  {square.cardId ? `Card ID: ${square.cardId}` : 'Empty Slot'}
                </div>
            ))}
          </div>
          <div className="right-column">
            <Button onClick={() => handleCardAction("DRAW")}>Draw Card</Button>
            <Button onClick={() => navigate("/navigation")}>Exit</Button>
          </div>
        </div>
      </BaseContainer>
  );
};

export default KittyCards;
