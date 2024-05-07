import React, { createContext, useState, useCallback } from "react";
import PropTypes from 'prop-types';



const GameContext = createContext({
  grid: [],
  hand: [],
  currentScore: 0,
  opponentScore: 0,
  gameStatus: "STARTING",
  currentTurnPlayerId: null,
  cardPileSize: 0,
  setGrid: () => {},
  setHand: () => {},
  setCurrentScore: () => {},
  setOpponentScore: () => {},
  setGameStatus: () => {},
  setCurrentTurnPlayerId: () => {},
  setCardPileSize: () => {},
  resetGame: () => {},
  handleCardDrop: () => {},
  updateGameState: () => {}
});

export const GameProvider = ({ children }) => {
  const [grid, setGrid] = useState([]);
  const [hand, setHand] = useState([]);
  const [currentScore, setCurrentScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [gameStatus, setGameStatus] = useState("STARTING");
  const [currentTurnPlayerId, setCurrentTurnPlayerId] = useState(null);
  const [cardPileSize, setCardPileSize] = useState(0);

  const resetGame = useCallback(() => {
    setGrid([]);
    setHand([]);
    setCurrentScore(0);
    setOpponentScore(0);
    setGameStatus("STARTING");
    setCurrentTurnPlayerId(null);
    setCardPileSize(0);
  }, []);


  const handleCardDrop = useCallback((cardId, squareId) => {
    const cardIndex = hand.findIndex(card => card.id === cardId);
    const squareIndex = grid.findIndex(square => square.id === squareId);
    if (cardIndex >= 0 && squareIndex >= 0 && !grid[squareIndex].occupied) {
      const newGrid = [...grid];
      newGrid[squareIndex] = {...newGrid[squareIndex], occupied: true, cards: [hand[cardIndex]]};
      const newHand = hand.filter((_, index) => index !== cardIndex);
      setGrid(newGrid);
      setHand(newHand);
    }
  }, [grid, hand]);

  const updateGameState = useCallback((newGameState) => {
    setGrid(newGameState.gridSquares || []);
    setHand(newGameState.playerHand || []);
    setCurrentScore(newGameState.currentScore);
    setOpponentScore(newGameState.opponentScore);
    setGameStatus(newGameState.gameStatus);
    setCurrentTurnPlayerId(newGameState.currentTurnPlayerId);
    setCardPileSize(newGameState.cardPileSize);
  }, []);

  return (
    <GameContext.Provider value={{
      grid, setGrid,
      hand, setHand,
      currentScore, setCurrentScore,
      opponentScore, setOpponentScore,
      gameStatus, setGameStatus,
      currentTurnPlayerId, setCurrentTurnPlayerId,
      cardPileSize, setCardPileSize,
      resetGame, handleCardDrop,
      updateGameState
    }}>
      {children}
    </GameContext.Provider>
  );
};

GameProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default GameContext;
