import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import { Button } from "components/ui/Button";
import { WebSocketContext } from "../context/WebSocketProvider";
import { useCurrUser } from "../context/UserContext";
import GameContext from "../context/GameContext";
import RenderHand from "components/ui/RenderHand";
import RenderBoard from "components/ui/RenderBoard";
import "styles/views/KittyCards.scss";
import { api, handleError } from "helpers/api";
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


const KittyCards = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('en'); // Default to English
  const navigate = useNavigate();
  const location = useLocation();
  const { gameId, opponentId,opponentName } = location.state;
  const { currUser } = useCurrUser();
  const { send, subscribeUser, unsubscribeUser } = useContext(WebSocketContext);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const messageEndRef = useRef(null);
  const storedUser = JSON.parse(sessionStorage.getItem("currUser"))
  const username = storedUser?.username;
  const [selectedCard, setSelectedCard] = useState(null);
  const {
    grid,
    hand,
    currentScore,
    opponentScore,
    gameStatus,
    setGrid,
    setHand,
    setCurrentScore,
    setOpponentScore,
    resetGame,
    handleCardDrop,
    updateGameState
  } = useContext(GameContext);
  const [isLoading, setIsLoading] = useState(true);

  //game/start could be avoided by passing entire gamestatedto after matchmaking finish directly but then we have to omit certain featuresm like progress bar



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

  // Stop further execution to prevent state updates after redirect

  useEffect(() => {
    const gameTopic = `/topic/game/${gameId}/${currUser.id}`;
    const chatTopic = `/topic/chat/${gameId}`;

    subscribeUser(gameTopic, (message) => {
      const update = JSON.parse(message.body);
      console.log("Game Update:", update);
      updateGameState(update);
      setIsLoading(false);
      if (update.gameStatus === "FINISHED") {
        navigate(`/kittycards/${gameId}/result/${username}`);
        resetGame();
      }
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

    api.post(`/game/${gameId}/${currUser.id}/start`)
      .catch(error => console.error("Error starting game:", error));

    return () => {
      unsubscribeUser(gameTopic);
      unsubscribeUser(chatTopic);
    };
  },   [gameId, currUser.id, navigate, subscribeUser, unsubscribeUser, updateGameState, resetGame]);

  useEffect(() => {
    const messageEnd = messageEndRef.current;
    if (messageEnd) {
      messageEnd.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages.length]);

  if (isLoading) {
    return <div>Loading game...</div>;
  }

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
  //Right now it would just immediately do it upon button press,
  //would like to first have pop that confirms if the click was intentional or not
  const handleSurrender= (gameId,playerId) => {
    sendSurrenderConfirmation(gameId,playerId);
  }

  function sendSurrenderConfirmation(gameId, playerId) {
    const surrenderMessage = {
      playerId: playerId,
      surrender: true
    };
    send(`/app/game/${gameId}/surrender`, JSON.stringify(
      {surrenderMessage}
    ));
  }


  const renderChatBox = () => (
    <div className="chat-container">
      <div className="message-container" style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {chatMessages.map((msg, index) => (
          <div key={msg.id} className={`message ${msg.senderId === currUser.id ? "self" : ""}`}>
            {msg.senderId === currUser.id ? "You" : msg.senderUsername}: {msg.text}
            {!msg.isTranslated && msg.senderId !== currUser.id && (
              <Button onClick={() => translateMessage(msg.id, selectedLanguage)}>
                Translate
              </Button>
            )}
          </div>
        ))}
        <div ref={messageEndRef} />
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



  const handleDragStart = (event, card) => {
    event.dataTransfer.setData("text/plain", card.id);
  };

  const handleSelectCard = (card) => {
    setSelectedCard(card);
  };

  const renderPlayerProfile = (playerName, score) => (
    <div className="player-profile">
      <img
        src={"iconTEMPLATE"}
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

  return (
    <BaseContainer>
      <div className="game-layout">
        <div className="left-column">
          <div>
            {renderChatBox()}
            </div>
            {renderPlayerProfile(username, currentScore)}
        </div>
        <div className="center-column">
          <RenderBoard
            grid={grid}
            onCardDrop={handleCardDrop}
          />
          <div className="hand-of-cards">
            <RenderHand
              hand={hand}
              onCardSelect={handleSelectCard}
              onDragStart={(event, card) => {
                event.dataTransfer.setData("text/plain", card.id);
              }}
            />
        </div>
        </div>
        <div className="right-column">
          <div>
            {renderPlayerProfile(opponentName, opponentScore)}
          </div>
          <div className="controls">
            <Button className="hint-btn">Hint</Button>
            <Button className="surrender-btn" onClick={()=>handleSurrender(gameId,currUser.id)}>Surrender</Button>
            <Button onClick={() => navigate("/main")}>Exit Game</Button>
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

export default KittyCards;
