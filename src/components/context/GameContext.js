import React, { createContext, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const GameContext = createContext(null);

export const GameProvider = ({ children }) => {
  const [grid, setGrid] = useState([]);
  const [hand, setHand] = useState([]);
  const [currentScore, setCurrentScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [gameStatus, setGameStatus] = useState("STARTING");
  const [currentTurnPlayerId, setCurrentTurnPlayerId] = useState(null);
  const [cardPileSize, setCardPileSize] = useState(0);

  const navigate = useNavigate();

  const resetGame = useCallback(() => {
    setGrid([]);
    setHand([]);
    setCurrentScore(0);
    setOpponentScore(0);
    setGameStatus("STARTING");
    setCurrentTurnPlayerId(null);
    setCardPileSize(0);
  }, []);

  return (
    <GameContext.Provider value={{
      grid,
      setGrid,
      hand,
      setHand,
      currentScore,
      setCurrentScore,
      opponentScore,
      setOpponentScore,
      gameStatus,
      setGameStatus,
      currentTurnPlayerId,
      setCurrentTurnPlayerId,
      cardPileSize,
      setCardPileSize,
      navigate,
      resetGame
    }}>
      {children}
    </GameContext.Provider>
  );
};

export default GameContext;
