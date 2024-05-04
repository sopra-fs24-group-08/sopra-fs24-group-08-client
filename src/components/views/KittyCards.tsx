import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import BaseContainer from "components/ui/BaseContainer";
import "../../styles/views/KittyCards.scss";
import Card from "components/ui/Card";
import { useCurrUser } from "../context/UserContext";
import { api, handleError } from "helpers/api";

const emptySlot = "empty";
const blockedSlot = "blocked";
const repository = "repo";

const colorToCup = {
  blue: `${process.env.PUBLIC_URL}/blue.png`,
  green: `${process.env.PUBLIC_URL}/green.png`,
  red: `${process.env.PUBLIC_URL}/red.png`,
  white: `${process.env.PUBLIC_URL}/white.png`
};

const colorToCard = {
  blue: `${process.env.PUBLIC_URL}/bluecard.png`,
  green: `${process.env.PUBLIC_URL}/greencard.png`,
  red: `${process.env.PUBLIC_URL}/redcard.png`,

};

interface Card {
  id: number;
  points: number;
  color: string;
}

const turnGridSquareToSlot = (gridSquares) => {
  return gridSquares.map(gridSquare => {
    let type = "blocked";
    if (gridSquare.card === null){type = "empty";}
    let color = gridSquare.color;
    return ({type: type, color: color});
  });
}

const setBoardGrid = (gridSquence, setGrid) => {
  setGrid([
    [gridSquence[0], gridSquence[3], gridSquence[5]],
    [gridSquence[1], repository, gridSquence[6]],
    [gridSquence[2], gridSquence[4], gridSquence[7]]
  ]);
}


export const KittyCards = (gameState) => {
  const { currUser } = useCurrUser();
  const [hand, setHand] = useState<Card[]>(null);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [showMessage, setShowMessage] = useState(false);
  const [grid, setGrid] = useState(null);
  const [playerId, setPlayerId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userScore, setUserScore] = useState(null);
  const [opponentName, setOpponentName] = useState(null);
  const [opponentScore, setOpponentScore] = useState(null);
  const [winnerId, setWinnerId] = useState(null);
  const [gameId, setGameId] = useState(null);
  const navigate = useNavigate();
  const indexMap = [[0,3,5], [1, undefined, 6], [2,4,7]];
  

  useEffect(() => {
    const gridSquence = turnGridSquareToSlot(gameState.gameState.board.gridSquares);
    setGameId(gameState.gameState.gameId);
    setBoardGrid(gridSquence, setGrid);
    const player = gameState.gameState.players.find(player => player.id === currUser.id);
    setHand(player.cards);
    const opponent = gameState.gameState.players.find(player => player.id !== currUser.id);
    setPlayerId(player.id);
    setUserName(player.id);
    setOpponentName(opponent.id);
    setUserScore(player.score);
    setOpponentScore(opponent.score);
    setWinnerId(gameState.gameState.winnerId)
    
  }, []);

  const renderGameBoard = () => {
    if (grid !== null){
      return (
        <div className="game-board">
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="game-board-row">
              {row.map((slot, columnIndex) => {
                let slotClasses = "game-board-slot";
                let slotContent;
                if (slot.type === "blocked") {
                  slotClasses += " game-board-center";
                  slotContent = <img
                    src={`${process.env.PUBLIC_URL}/blocked.png`}
                    style={{
                      display: "block",
                      width: "80%",
                      height: "auto",
                    }}
                    alt=""
                  />;
                } else if (slot.type === "empty") {
                  slotContent = <img
                    src={colorToCup[slot.color]}
                    style={{
                      display: "block",
                      width: "80%",
                      height: "auto",
                    }}
                    alt=""/>;
                } else{
                  slotContent = <img
                    src={`${process.env.PUBLIC_URL}/repo.png`}
                    style={{
                      display: "block",
                      width: "80%",
                      height: "auto",
                    }}
                    alt=""
                  />;
                }
                return (
                  <div
                    key={`${rowIndex}-${columnIndex}`}
                    className={slotClasses}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleCardDrop(e, rowIndex, columnIndex)}
                  >
                    {slotContent}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      );
    }
    return (
      <BaseContainer>
        <div style={{ padding: "20px", textAlign: "center" }}>
          <h2>Loading...</h2>
        </div>
      </BaseContainer>
    );
  };

  const renderHand = () => {
    if (grid !== null){
      return (
        <div className="hand-of-cards">
          {hand.map((card: Card) => (
            <Card
              key={card.id}
              id={card.id}
              points={card.points}
              color={card.color}
              src={colorToCard[card.color]}
              onClick={() => selectCardFromHand(card)}
              draggable="true"
              onDragStart={(e) => handleDragStart(e, card)}
            />
          ))}
        </div>
      );
    }
    return (
      <BaseContainer>
        <div style={{ padding: "20px", textAlign: "center" }}>
          <h2>Loading...</h2>
        </div>
      </BaseContainer>
    );
  };

    // Function to render the player's profile
  const renderPlayerProfile = (playerName, score) => (
    <div className="player-profile">
      <img
        src={`${process.env.PUBLIC_URL}/avatar.png`}
        style={{
          display: "block",
          width: "40%",
          height: "auto",
        }}
        alt=""
      />
      <div className="player-name">{playerName}</div>
      <div className="player-score">score: {score}</div>
    </div>
  );

  const selectCardFromHand = (card: Card) => {
    setSelectedCard(card);
  };

  const handleDragStart = (event, card) => {
    console.log("you drag a card");
    event.dataTransfer.setData("text/plain", card.id.toString());
    event.currentTarget.style.opacity = "0.5";
  };

  const handleCardDrop = (event, rowIndex, columnIndex) => {
    event.preventDefault();
    const cardId = parseInt(event.dataTransfer.getData("text/plain"), 10);
    const cardToPlace = hand.find(card => card.id === cardId);
    console.log(cardId);
    console.log(grid[rowIndex][columnIndex].type);

    if (cardToPlace && grid[rowIndex][columnIndex].type === "empty") {
      // 一旦确定格子为空，立即设置为blocked防止重复放置
      const newGrid = grid.map((row, rIndex) =>
        rIndex === rowIndex
          ? row.map((slot, cIndex) => cIndex === columnIndex ? { ...slot, type: "blocked" } : slot)
          : row
      );
      setGrid(newGrid);
      placeCard(rowIndex, columnIndex, cardToPlace);
      setHand(hand.filter(card => card.id !== cardId)); // 从手牌中移除
    } else {
      alert("You can only place a card on an empty slot.");
    }
  };

  const drawCard = () => {
    const newCardId = Math.max(...hand.map(c => c.id)) + 1; // Get the next ID
    const newCard = { id: newCardId, name: `Card ${newCardId}` };

    // Update the hand state to include the new card
    setHand(hand.concat(newCard));
  };

  const placeCard = async(rowIndex: number, columnIndex: number, card = selectedCard) => {
    // Check if the center slot is clicked, if so draw a card
    console.log("now you drop a card.")
    if (!card) {
      alert("Please select a card first.");
      return;
    }
    if (rowIndex === 1 && columnIndex === 1) {
      drawCard();
      return; // Early return to prevent further actions since it's a special slot
    }
    // Check if a card is selected
    if (!selectedCard) {
      alert("Please select a card first.");
      return;
    }
    // Check if the slot is blocked or already occupied
    if (grid[rowIndex][columnIndex] === blockedSlot || grid[rowIndex][columnIndex]) {
      alert("This slot is not available.");
      return;
    }
    // Remove the card from the player's hand
    // setHand(hand.filter((card) => card.id !== selectedCard.id));
    try{
      let moveType = "PLACE";
      let cardId = card.id;
      let position = indexMap[rowIndex][columnIndex];
      const response = await api.post(`/games/${gameId}/users/${currUser.id}/move`, {playerId, cardId, position, moveType});
      console.log("you make a move.")
    }catch (error) {
      handleError(error);
    } 
    // Clear the selected card
    setSelectedCard(null);
  };

  const doExit = async() => {

    setShowMessage(true);
    const response = await api.delete(`/games/${gameId}/users/${currUser.id}/quit`);
    
  };

  function renderContent() {
    if (winnerId) {
      // return <KittyCards gameState={gameState} />;
      return (
        <BaseContainer>
          <div style={{ padding: "20px", textAlign: "center" }}>
            <h2>{winnerId} wins the game!</h2>
          </div>
        </BaseContainer>
      );
    }
    return (
      <BaseContainer>
        <div className="game-layout">
        <div className="left-column">
            <button onClick={() => navigate("/tutorial")} className="hint-btn">Tutorial</button>
            {renderPlayerProfile(opponentName, opponentScore)}
          </div>
          <div className="center-column">
            {renderGameBoard()}
            <div className="hand-of-cards">
              {renderHand()}
            </div>
          </div>
          <div className="right-column">
            {renderPlayerProfile(userName, userScore)}
            <div className="controls">
            <Button className="hint-btn">Hint</Button>
            <Button className="surrender-btn">Surrender</Button>
            <Button className="exit-btn" onClick={() => doExit()}>Exit</Button>
          </div>
          </div>
        </div>
      </BaseContainer>
    );
  }

  return (
    <div>
      {renderContent()}
    </div>
  );
};

export default KittyCards;