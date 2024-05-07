import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import BaseContainer from "components/ui/BaseContainer";
import "../../styles/views/KittyCards.scss";
import Card from "components/ui/Card";
import { useCurrUser } from "../context/UserContext";
import { api, handleError } from "helpers/api";
// @ts-ignore
import repo from "../../images/repo.png";
// @ts-ignore
import avatar from "../../images/avatar.png";
// @ts-ignore
import blue from "../../images/blue.png"
// @ts-ignore
import bluecard from "../../images/bluecard.png"
// @ts-ignore
import red from "../../images/red.png"
// @ts-ignore
import redcard from "../../images/redcard.png"
// @ts-ignore
import green from "../../images/green.png"
// @ts-ignore
import greencard from "../../images/greencard.png"
// @ts-ignore
import white from "../../images/white.png"
// @ts-ignore
import occupiedBlue from "../../images/occupiedBlue.png"
// @ts-ignore
import occupiedRed from "../../images/occupiedRed.png"
// @ts-ignore
import occupiedGreen from "../../images/occupiedGreen.png"
// @ts-ignore
import occupiedWhite from "../../images/occupiedWhite.png"

const emptySlot = "empty";
const blockedSlot = "blocked";
const repository = "repo";

const colorToCup = {
  blue: blue,
  green: green,
  red: red,
  white: white,
};

const colorToCard = {
  blue: bluecard,
  green: greencard,
  red: redcard,
};

const colorToOccupied = {
  green: occupiedGreen,
  blue: occupiedBlue,
  red: occupiedRed,
  white: occupiedWhite
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
    setUserName(player.playerName);
    setOpponentName(opponent.id);
    setUserScore(player.score);
    setOpponentScore(opponent.score);
    setWinnerId(gameState.gameState.winnerId)
    
  }, [gameState]);

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
                    src={colorToOccupied[slot.color]}
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
                    src={repo}
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
                    onClick = {() => drawCard(rowIndex, columnIndex)}
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

  const handleDragStart = (event, card) => {
    console.log("you drag a card");
    event.dataTransfer.setData("text/plain", card.id.toString());
    event.currentTarget.style.opacity = "0.5";
  };

  const handleCardDrop = async(event, rowIndex, columnIndex) => {
    event.preventDefault();
    const cardId = parseInt(event.dataTransfer.getData("text/plain"), 10);
    const cardToPlace = hand.find(card => card.id === cardId);

    if (!cardToPlace){
      alert("You have to choose a card to place!");
      return;
    }

    if (grid[rowIndex][columnIndex].type !== "empty"){
      alert("You can only place a card on an empty slot.");
      return;
    }

    if (rowIndex === 1 && columnIndex === 1){
      alert("You can't place a card to the central pile.")
      event.dataTransfer.setData("text/plain", null);
      return;
    }

    if (gameState.gameState.currentTurnPlayerId !== currUser.id){
      alert("It's not your turn, please wait.")
    }

    try{
      let moveType = "PLACE";
      let cardId = cardToPlace.id;
      let position = indexMap[rowIndex][columnIndex];
      const response = await api.post(`/games/${gameId}/users/${currUser.id}/move`, {playerId, cardId, position, moveType});
      console.log("you make a move.")
    }catch (error) {
      handleError(error);
    } 

    
  };

  const drawCard = async(rowIndex, columnIndex) => {
    if (gameState.gameState.currentTurnPlayerId !== currUser.id){
      alert("It's not your turn, please wait.")
    }

    if (rowIndex === 1 && columnIndex === 1){
      try{
        let moveType = "DRAW";
        const response = await api.post(`/games/${gameId}/users/${currUser.id}/move`, {playerId, moveType});
        console.log("you draw a card.")
      }catch (error) {
        handleError(error);
      } 
    }

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
            <Button className="exit-btn" onClick={()=>navigate("/main")}>Back to Main</Button>
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