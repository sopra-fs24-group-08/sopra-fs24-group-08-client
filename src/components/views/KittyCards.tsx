import React, { useState, useEffect, useRef, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import BaseContainer from "components/ui/BaseContainer";
import "../../styles/views/KittyCards.scss";
import Card from "components/ui/Card";
import { WebSocketContext } from "components/context/WebSocketProvider"
import { useCurrUser } from "../context/UserContext";

const getRandomColor = () => {
  const colors = ["blue", "green", "red", "white"];
  return colors[Math.floor(Math.random() * colors.length)];
};

const getEmptySlot = () => ({ type: "empty", color: getRandomColor() });

const initialGrid = () => [
  [getEmptySlot(), getEmptySlot(), getEmptySlot()],
  [getEmptySlot(), "repository", getEmptySlot()],
  [getEmptySlot(), getEmptySlot(), getEmptySlot()]
];

const colorToCup = {
  blue: `${process.env.PUBLIC_URL}/blue.png`,
  green: `${process.env.PUBLIC_URL}/green.png`,
  red: `${process.env.PUBLIC_URL}/red.png`,
  white: `${process.env.PUBLIC_URL}/white.png`
};

const colorToCard = {
  blue: `${process.env.PUBLIC_URL}/bluecard.png`,
  green: `${process.env.PUBLIC_URL}/greencard.png`,
  red: `${process.env.PUBLIC_URL}/redcard.png`
};

const KittyCards = () => {
  const location = useLocation();
  const { gameId, isFirst, opponentId } = location.state;
  const navigate = useNavigate();
  const { currUser } = useCurrUser();
  const { send, subscribeUser, unsubscribeUser } = useContext(WebSocketContext);
  const [grid, setGrid] = useState(initialGrid);
  const [hand, setHand] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const messageEndRef = useRef(null);
  const [coinFlipResult, setCoinFlipResult] = useState(isFirst ? "heads" : "tails");//use to display fake coinflip

  useEffect(() => {
    const gameTopic = `/topic/game/${gameId}`;
    const chatTopic = `/topic/chat/${gameId}`;

    subscribeUser(gameTopic, (message) => {
      const update = JSON.parse(message.body);
      console.log("Game Update:", update);
    });

    subscribeUser(chatTopic, (message) => {
      const chat = JSON.parse(message.body);
      setChatMessages(prev => [...prev, chat]);
    });

    return () => {
      unsubscribeUser(gameTopic);
      unsubscribeUser(chatTopic);
    };
  }, [subscribeUser, unsubscribeUser, gameId, currUser.id]);

  const sendChatMessage = () => {
    if (chatInput.trim()) {
      send(`/app/chat/${gameId}`, JSON.stringify({ message: chatInput, senderId: currUser.id, receiverId: opponentId }));
      setChatInput("");
    }
  };

  const handleDragStart = (event, card) => {
    event.dataTransfer.setData("text/plain", card.id);
  };

  const handleCardDrop = (event, rowIndex, columnIndex) => {
    const cardId = parseInt(event.dataTransfer.getData("text/plain"));
    const cardToPlace = hand.find(card => card.id === cardId);
    if (cardToPlace && grid[rowIndex][columnIndex].type === "empty") {
      setGrid(currentGrid => currentGrid.map((row, rIndex) => {
        return row.map((cell, cIndex) => {
          if (rIndex === rowIndex && cIndex === columnIndex) {
            return { ...cell, type: "card", color: cardToPlace.color };
          }
          return cell;
        });
      }));
      setHand(currentHand => currentHand.filter(card => card.id !== cardId));
    }
  };

  const renderGrid = () => {
    return grid.map((row, rowIndex) => (
      <div key={rowIndex} className="grid-row">
        {row.map((cell, colIndex) => (
          <div
            key={colIndex}
            className={`grid-cell ${cell.type}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleCardDrop(e, rowIndex, colIndex)}
          >
            {cell.type === "card" && (
              <img src={colorToCup[cell.color]} alt="" style={{ width: "100%" }} />
            )}
          </div>
        ))}
      </div>
    ));
  };

  const renderChat = () => {
    return (
      <div className="chat-box">
        {chatMessages.map((msg, index) => (
          <div key={index} className="chat-message">{msg.senderId === currUser.id ? "You" : "Opponent"}: {msg.text}</div>
        ))}
        <div className="chat-input">
          <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} />
          <button onClick={sendChatMessage}>Send</button>
        </div>
      </div>
    );
  };

  return (
    <BaseContainer>
      <h2>Kitty Cards Game</h2>
      <div>{coinFlipResult === "heads" ? "You won the coin flip!" : "You lost the coin flip!"}</div>
      {renderGrid()}
      {renderChat()}
      <Button onClick={() => navigate("/main")}>Exit Game</Button>
    </BaseContainer>
  );
};

export default KittyCards;
