import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import { Button } from "components/ui/Button";
import Card from "components/ui/Card";
import { WebSocketContext } from "../context/WebSocketProvider";
import { useCurrUser } from "../context/UserContext";
import "../../styles/views/KittyCards.scss";
import {api,handleError} from "helpers/api"
import { useData } from '../context/DataContext';
import { User } from "../../types";
import PropTypes from 'prop-types';

const languageOptions = {
  en: 'English',
  de: 'German',
  fr: 'French',
  es: 'Spanish',
  ru: 'Russian',
  zh: 'Chinese',
};

const LanguageSelector = ({ onChange }) => (
  <select onChange={onChange} className="language-selector">
    {Object.entries(languageOptions).map(([code, name]) => (
      <option value={code} key={code}>{name}</option>
    ))}
  </select>
);

LanguageSelector.propTypes = {
  onChange: PropTypes.func.isRequired
};

const emptySlot = "empty";
const blockedSlot = "blocked";
const repository = "repo";

const getRandomColor = () => {
  const colors = ["blue", "green", "red", "white"];
  return colors[Math.floor(Math.random() * colors.length)];
};

const getEmptySlot = () => ({ type: "empty", color: getRandomColor() });

const initialGrid = () => [
  [getEmptySlot(), getEmptySlot(), getEmptySlot()],
  [getEmptySlot(), repository, getEmptySlot()],
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
  red: `${process.env.PUBLIC_URL}/redcard.png`,
};

const KittyCards = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('en'); // Default to English
  const navigate = useNavigate();
  const location = useLocation();
  const { gameId, opponentId } = location.state;
  const { currUser } = useCurrUser();
  const { send, subscribeUser, unsubscribeUser } = useContext(WebSocketContext);
  const [hand, setHand] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [grid, setGrid] = useState(initialGrid());
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const messageEndRef = useRef(null);

  //const { data , refreshData } = useData();
  //const User = sessionStorage.getItem("currUser");
  //Better to just get user objects passed once match is getting started instead of using refreshData:


  const translateMessage = async (messageId, targetLang) => {
    const messageIndex = chatMessages.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1) {
      console.error("Message not found");
      return;
    }

    try {
      const response = await api.get(`/api/translate`, {
        params: {
          text: chatMessages[messageIndex].text,
          targetLang: targetLang
        }
      });

      if (response.status === 200 && response.data) {
        const decodedText = decodeURIComponent(response.data);
        const newMessages = [...chatMessages];
        newMessages[messageIndex] = {
          ...newMessages[messageIndex],
          text: decodedText,  // Use the decoded text
          isTranslated: true  // Mark as translated
        };
        setChatMessages(newMessages);
      } else {
        console.error("Failed to translate message:", response.statusText);
      }
    } catch (error) {
      console.error('Translation error:', error);
    }
  };

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
  };

  const sendMove = async (cardId, position, moveType) => {
    const move = {
      playerId: currUser.id,
      cardId: cardId,
      position: position,
      moveType: moveType
    };

    try {
      await send(`/app/game/${gameId}`, JSON.stringify(move));
    } catch (error) {
      console.error('Error sending move:', error);
      // Optionally handle reconnection or user notification here
    }
  };


  useEffect(() => {
    const gameTopic = `/topic/game/${gameId}/${currUser.id}`;
    const chatTopic = `/topic/chat/${gameId}`;

    subscribeUser(gameTopic, (message) => {
      const update = JSON.parse(message.body);
      console.log("Game Update:", update);
      //setPlayers(gameUpdate.players);
   //   setBoard(gameUpdate.board.gridSquares);
    // setCurrentTurnPlayerId(gameUpdate.currentTurnPlayerId);
      //setGameStatus(gameUpdate.gameStatus);
    });

    subscribeUser(chatTopic, (message) => {
      const chat = JSON.parse(message.body);
      console.log("Received message:", chat);
      setChatMessages(prev => [...prev, {
        id: chat.id,
        text: chat.messageContent,
        senderId: chat.senderId,
        timestamp: chat.timestamp,
        senderUsername: chat.senderUsername,
        isTranslated: false
      }]);
    });

    return () => {
      unsubscribeUser(gameTopic);
      unsubscribeUser(chatTopic);
    };
  }, [subscribeUser, unsubscribeUser, gameId]);

  const sendChatMessage = () => {
    if (chatInput.trim()) {
      send(`/app/chat/${gameId}`, JSON.stringify({
        message: chatInput,
        senderId: currUser.id,
        receiverId: opponentId
      }));
      setChatInput("");
    }
  };

  const renderChatBox = () => (
    <div className="chat-container">
      <div className="message-container">
        {chatMessages.map((msg) => (
          <div key={msg.id} className={`message ${msg.senderId === currUser.id ? "self" : ""}`}>
            {msg.senderId === currUser.id ? "You" : msg.senderUsername}: {msg.text}
            {!msg.isTranslated && msg.senderId !== currUser.id && (
              <Button onClick={() => translateMessage(msg.id, selectedLanguage)}>
                Translate
              </Button>
            )}
          </div>
        ))}
      </div>
      <div className="chat-controls">
        <LanguageSelector onChange={handleLanguageChange} />
        <input
          type="text"
          className="chat-input"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button className="chat-send-btn" onClick={sendChatMessage}>Send</button>
      </div>
    </div>
  );


  useEffect(() => {
    const scrollToBottom = () => {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    scrollToBottom();
  }, [chatMessages]);

  const handleDragStart = (event, card) => {
    event.dataTransfer.setData("text/plain", card.id);
  };
  const handleCardDrop = (event, rowIndex, columnIndex) => {
    const cardId = parseInt(event.dataTransfer.getData("text/plain"));
    const cardToPlace = hand.find(card => card.id === cardId);

    if (cardToPlace) {
      placeCard(rowIndex, columnIndex, cardToPlace);
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

  const renderGameBoard = () => (
    <div className="game-board">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="game-board-row">
          {row.map((slot, columnIndex) => {
            let slotClasses = "game-board-slot " + (slot.type === "blocked" ? "blocked-slot" : "");
            return (
              <div
                key={`${rowIndex}-${columnIndex}`}
                className={slotClasses}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleCardDrop(e, rowIndex, columnIndex)}
              >
                <img
                  src={slot.type === "repository" ? `${process.env.PUBLIC_URL}/repo.png` : colorToCup[slot.color]}
                  style={{ width: "100%", display: "block" }}
                  alt=""
                />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );

  const selectCardFromHand = (card) => {
    setSelectedCard(card);
  };
  const renderHand = () => (
    <div className="hand-of-cards">
      {hand.map((card: typeof Card) => (
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


  return (
    <BaseContainer>
      <div className="game-layout">
        <div className="left-column">
            <div className="player-profile"> {/* Your profile */}
              <span>{currUser.username}</span>
              <img src="USERICONS-ORSO.png" alt="Profile" />
            </div>
          {renderChatBox()}
        </div>
        <div className="center-column">
          {renderGameBoard()}
          <div className="hand-of-cards">
            {hand.map((card) => (
              <Card
                key={card.id}
                id={card.id}
                name={card.name}
                points={card.points}
                color={card.color}
                src={colorToCard[card.color]}
                onClick={() => selectCardFromHand(card)}
                draggable="true"
                onDragStart={(e) => {
                  e.dataTransfer.setData("text/plain", card.id.toString());
                }}
              />
            ))}
          </div>
        </div>
        <div className="right-column">
          <div className="opponent-profile"> {/* I will just start passing entire user objects that also include icons of opponenent*/}
            <span>{opponentId}</span>
            <img src="/OPPONENTICONORSO.png" alt="Opponent" />
          </div>
          <div className="controls">
            <Button className="hint-btn">Hint</Button>
            <Button className="surrender-btn">Surrender</Button>
            <Button onClick={() => navigate("/main")}>Exit Game</Button>
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

export default KittyCards;
