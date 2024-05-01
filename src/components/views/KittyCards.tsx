import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import BaseContainer from "components/ui/BaseContainer";
import "../../styles/views/KittyCards.scss";
import Card from "components/ui/Card";
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


/*const emptySlot = "empty";
const blockedSlot = "blocked";
const repository = "repo";*/

const getRandomColor = () => {
  const colors = ["blue", "green", "red","white"];

  return colors[Math.floor(Math.random() * colors.length)];
};
const getEmptySlot = () => ({ type: "empty", color: getRandomColor() });
const getRepoSlot = () => ({ type: "repo" });
const convertToBlocked = (slot: { type: string; color: string; }) => {
  return { ...slot, type: "blocked" };
};
const initialGrid = () => [
  [getEmptySlot(), getEmptySlot(), getEmptySlot()],
  [getEmptySlot(), getRepoSlot(), getEmptySlot()],
  [getEmptySlot(), getEmptySlot(), getEmptySlot()]
];

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
  name: string;
  points: number;
  color: string;
}

// Initial set of cards in the player's hand
const initialHand: Card[] = [
  { id: 1, name: "Card 1", points: 5, color: "blue" },
  { id: 2, name: "Card 2", points: 3, color: "red"  },
  { id: 3, name: "Card 3", points: 6, color: "green"  },
  { id: 4, name: "Card 4", points: 2 , color: "blue" },
  { id: 5, name: "Card 5", points: 1 , color: "red" },
  { id: 6, name: "Card 6", points: 5 , color: "red" },
];

const KittyCards = () => {
  const [hand, setHand] = useState<Card[]>(initialHand);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [showMessage, setShowMessage] = useState(false);
  const [grid, setGrid] = useState(initialGrid());
  const navigate = useNavigate();
  // Add state for managing chat messages
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: "Good game!", author: "Jane" },
    { id: 2, text: "Yes it is!", author: "John" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [displayVideo, setDisplayVideo] = useState(false);
  const messageEndRef = useRef(null);

  // Function to send a chat message
  const sendChatMessage = () => {
    if (chatInput.trim() !== "") {
      const newMessage = {
        id: chatMessages.length + 1, // Simple ID generation for example
        text: chatInput,
        author: "John" // Assuming 'John' is the current player
      };
      setChatMessages([...chatMessages, newMessage]);
      setChatInput(""); // Clear input after sending
    }
  };

  // Function to render the chat box
  const renderChatBox = () => (
    <div className="chat-box">

    </div>
  );


  useEffect(() => {
    const scrollToBottom = () => {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    scrollToBottom();
  }, [chatMessages]);


  const renderGameBoard = () => {
    return (
      <div className="game-board">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="game-board-row">
            {row.map((slot, columnIndex) => {
              let slotClasses = "game-board-slot";
              let slotContent;
              if (slot.type === "blocked") {
                slotContent = <img
                  src={colorToOccupied[slot.color]}
                  style={{
                    display: "block",
                    width: "80%",
                    height: "auto",
                  }}
                  alt=""/>;

              } else if (slot.type === "empty") {
                slotContent = <img
                  src={colorToCup[slot.color]}
                  style={{
                    display: "block",
                    width: "80%",
                    height: "auto",
                  }}
                  alt=""/>;
              } else if (slot.type === "repo"){
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
  };
  const renderPlayerControls = () => {
    // Implementation of player profiles with avatars, scores and action buttons
  };

  // Function to render the player's profile
  const renderPlayerProfile = (playerName, score) => (
    <div className="player-profile">
      <img
        src={avatar}
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

  const renderHand = () => (
    <div className="hand-of-cards">
      {hand.map((card: Card) => (
        <Card
          key={card.id}
          id={card.id}
          name={card.name}
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
  const handleDragStart = (event, card) => {
    event.dataTransfer.setData("text/plain", card.id.toString());
    event.currentTarget.style.opacity = "0.5";
  };

  const handleCardDrop = (event, rowIndex, columnIndex) => {
    event.preventDefault();
    const cardId = parseInt(event.dataTransfer.getData("text/plain"), 10);
    const cardToPlace = hand.find(card => card.id === cardId);

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

  const placeCard = (rowIndex: number, columnIndex: number, card = selectedCard) => {
    // Check if the center slot is clicked, if so draw a card
    if (!card) return;
    if (rowIndex === 1 && columnIndex === 1) {
      drawCard();

      return; // Early return to prevent further actions since it's a special slot
    }
    // Check if the slot is blocked or already occupied
    if (grid[rowIndex][columnIndex].type === "blocked" || grid[rowIndex][columnIndex]) {

      return;
    }

    // Create a deep copy of the grid and update the slot with the selected card
    const newGrid = grid.map((row, rIndex) =>
      rIndex === rowIndex
        ? row.map((slot, cIndex) => cIndex === columnIndex ? selectedCard : slot)
        : row
    );

    setGrid(newGrid);
    // Remove the card from the player's hand
    setHand(hand.filter((card) => card.id !== selectedCard.id));
    // Clear the selected card
    setSelectedCard(null);
  };


  const doExit = () => {

    setShowMessage(true);

    setTimeout(() => {
      navigate("/navigation");
    }, 2000); //
  };


  return (
    <BaseContainer>
      <div className="game-layout">
        {/* Left column for chat and player info */}
        <div className="left-column">
          <button onClick={() => navigate("/tutorial")} className="hint-btn">Tutorial</button>
          {renderChatBox()}
          {/* Player's avatar and score here if needed */}
          <div className="chat-container">
            {/* 消息滚动区域 */}
            <div className="message-container">
              {chatMessages.map(message => (
                <div key={message.id} className={`message ${message.author === "John" ? "self" : ""}`}>
                  <span className="message-author">{message.author}: </span>
                  {message.text}
                </div>
              ))}
              {/* 这里是新添加的 div 用于滚动定位 */}
              <div ref={messageEndRef} />
            </div>
            {/* 输入和发送控制区域 */}
            <div className="chat-controls">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type a message..."
                className="chat-input"
              />
              <button onClick={sendChatMessage} className="chat-send-btn">Send</button>
            </div>
          </div>

          {renderPlayerProfile("John S", 18)}
        </div>

        {/* Center column for the game board */}
        <div className="center-column">
          {renderGameBoard()}
          {/* Render the hand of cards */}
          <div className="hand-of-cards">
            {renderHand()}
          </div>
        </div>
        {/* Opponent info and controls */}
        <div className="right-column">
          {renderPlayerProfile( "Jane W", 28)}
          <div className="controls">
            <Button className="hint-btn">Hint</Button>
            <Button className="surrender-btn">Surrender</Button>
            <Button className="exit-btn" onClick={() => doExit()}>Exit</Button>
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

export default KittyCards;