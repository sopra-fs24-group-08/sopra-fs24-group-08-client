import React, { createContext, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { useCurrUser } from "./UserContext";
import { useWebSocket } from "./WebSocketProvider";
import { useParams } from "react-router-dom";


const GameContext = createContext({
  grid: [],
  hand: [],
  currentScore: 0,
  opponentScore: 0,
  gameStatus: "STARTING",
  currentTurnPlayerId: null,
  cardPileSize: 0,
  setGrid: () => {
  },
  setHand: () => {
  },
  setCurrentScore: () => {
  },
  setOpponentScore: () => {
  },
  setGameStatus: () => {
  },
  setCurrentTurnPlayerId: () => {
  },
  setCardPileSize: () => {
  },
  resetGame: () => {
  },
  handleCardDrop: () => {
  },
  updateGameState: () => {
  },
});

export const GameProvider = ({ children }) => {

  const { currUser } = useCurrUser();
  const { send } = useWebSocket();
  const { gameId } = useParams();
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


  const drawCardMove = useCallback(async (squareId) => {
    // Ensure it's the user's turn
    if (currentTurnPlayerId !== currUser.id) {
      alert("It's not your turn.");

      return;
    }

    // Check if the square is the middle one
    if (squareId !== 4) {
      alert("You can only draw from the middle card pile.");

      return;
    }

    // Check if there are cards left to draw
    if (cardPileSize === 0) {
      alert("No cards left to draw.");

      return;
    }

    const move = {
      playerId: currUser.id,
      cardId: "",
      position: squareId,
      moveType: "DRAW",
    };

    try {
      // Send draw card move to server
      await send(`/app/game/${gameId}/move`, JSON.stringify(move));
      console.log("Draw card move sent to server:", move);
    } catch (error) {
      console.error("Error sending draw card move:", error);
      alert("Failed to draw a card. Please try again.");
    }
  }, [cardPileSize, currentTurnPlayerId, send, gameId, currUser.id]);


  const handleCardDrop = useCallback(async (event, squareId) => {
    console.log(squareId, "DDLDLDL");
    event.preventDefault();
    const cardId = parseInt(event.dataTransfer.getData("text/plain"), 10);
    const cardToPlace = hand.find(card => card.id === cardId);

    if (!cardToPlace || currentTurnPlayerId !== currUser.id) {
      alert("Invalid move or not your turn.");

      return;
    }
    //const validsqrIdx = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const squareIndex = grid.findIndex(square => square.id === squareId);
    console.log(squareIndex, "DOSOODS");
    if (0 > squareIndex || squareIndex === 4) { // Check for valid square and not the center pile
      alert("Invalid move.");

      return;
    }


    if (grid[squareIndex].occupied) {
      alert("This slot is already occupied.");

      return;
    }

    const move = {
      playerId: currUser.id,
      cardId: cardId,
      position: squareIndex,
      moveType: "PLACE",
    };

    try {
      // Send move to server
      console.log("move", move);
      await send(`/app/game/${gameId}/move`, JSON.stringify(move));
      console.log("Move sent to server:", move);

      // Update local state assuming the move is valid and accepted
      const newGrid = [...grid];
      newGrid[squareIndex] = { ...newGrid[squareIndex], occupied: true, cards: [cardToPlace] };
      const newHand = hand.filter(card => card.id !== cardId);

      setGrid(newGrid);
      setHand(newHand);
      console.log("Hand", newHand);
      console.log("Grid", newGrid);
    } catch (error) {
      console.error("Error sending move:", error);
      alert("Failed to send move. Please try again.");
    }
  }, [grid, hand, send, gameId, currUser.id, currentTurnPlayerId]);

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
      drawCardMove,
      updateGameState,
    }}>
      {children}
    </GameContext.Provider>
  );
};

GameProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default GameContext;
