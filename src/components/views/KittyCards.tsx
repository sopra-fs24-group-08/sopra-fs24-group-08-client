import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import { Button } from "components/ui/Button";
import { useWebSocket } from "../context/WebSocketProvider";
import { useCurrUser } from "../context/UserContext";
import GameContext from "../context/GameContext";
import RenderHand from "components/ui/RenderHand";
import RenderBoard from "components/ui/RenderBoard";
import "styles/views/KittyCards.scss";
import { api } from "helpers/api";
import PropTypes from "prop-types";
import translateIcon from "../../images/Translate_Icon.png";
import Modal from "helpers/Modal";

const languageOptions = {
  en: "English",
  de: "German",
  fr: "French",
  es: "Spanish",
  ru: "Russian",
  zh: "Chinese",
};//Verify the quality of the translation, English-German-Spanish was surprisingly bad

const LanguageSelector = ({ onChange }) => (
  <select onChange={onChange} className="language-selector">
    {Object.entries(languageOptions).map(([code, name]) => (
      <option value={code} key={code}>{name}</option>
    ))}
  </select>
);

LanguageSelector.propTypes = {
  onChange: PropTypes.func.isRequired,
};


const KittyCards = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("en"); // Default to English
  const navigate = useNavigate();
  const location = useLocation();
  const { gameId, opponentId, opponentName ,initialStatus} = location.state;
  const { currUser } = useCurrUser();
  const { send, subscribeUser, unsubscribeUser } = useWebSocket();
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const messageEndRef = useRef(null);
  const storedUser = JSON.parse(sessionStorage.getItem("currUser"));
  const username = storedUser?.username;
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRetryButton, setShowRetryButton] = useState(false);


  const {
    grid,
    hand,
    currentScore,
    opponentScore,
    handleCardDrop,
    updateGameState,
    resetGame
  } = useContext(GameContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if all required state fields exist
    if (location.state && location.state.gameId && location.state.opponentId && location.state.opponentName && location.state.initialStatus) {
      const { gameId, opponentId, opponentName, initialStatus } = location.state;
      // Optionally save the state in sessionStorage or handle it as required
      const gameState = { gameId, opponentId, opponentName, initialStatus };
      sessionStorage.setItem("gameState", JSON.stringify(gameState));
    } else {
      // Log the error and navigate to a fallback route if any field is missing
      console.error("Required game state missing");
    }
  }, [navigate, location.state]);

  const translateMessage = async (messageId, targetLang) => {
    const messageIndex = chatMessages.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1) {
      console.error("Message not found");

      return;
    }

    try {
      const response = await api.get("/api/translate", {
        params: {
          text: chatMessages[messageIndex].text,
          targetLang: targetLang,
        },
      });

      if (response.status === 200 && response.data) {
        const decodedText = decodeURIComponent(response.data);
        const newMessages = [...chatMessages];
        newMessages[messageIndex] = {
          ...newMessages[messageIndex],
          text: decodedText,  // Use the decoded text
          isTranslated: true,  // Mark as translated
        };
        setChatMessages(newMessages);
      } else {
        console.error("Failed to translate message:", response.statusText);
      }
    } catch (error) {
      console.error("Translation error:", error);
    }
  };

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
  };


  useEffect(() => {
    const gameTopic = `/topic/game/${gameId}/${currUser.id}`;
    const chatTopic = `/topic/chat/${gameId}`;

    subscribeUser(gameTopic, (message) => {
      const update = JSON.parse(message.body);
      console.log("Game Update:", update);
      if (update.gameStatus === "FINISHED") {
        // Enforce properly cleanup and navigation
        setTimeout(() => {
          sessionStorage.removeItem("gameState")
          unsubscribeUser(gameTopic);
          unsubscribeUser(chatTopic);

          navigate(`/kittycards/${update.gameId}/result`);
        }, 300);
        // Delay to ensure all final messages are processed
      }
      updateGameState(update);
      setIsLoading(false);
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
        isTranslated: false,
      }]);
    });
    if(initialStatus === "ONGOING") {
      api.post(`/game/${currUser.id}/${currUser.token}/refresh`,null, {headers: { Authorization: `Bearer ${currUser.token}` }})
        .catch(error => console.error("Error starting game:", error));
    }else{
      api.post(`/game/${gameId}/${currUser.id}/start`)
        .catch(error => console.error("Error starting game:", error));
    }

    return () => {
      unsubscribeUser(gameTopic);
      unsubscribeUser(chatTopic);
    };
  }, [gameId, currUser.id, navigate, subscribeUser, unsubscribeUser, updateGameState,location]);

  useEffect(() => {
    const messageEnd = messageEndRef.current;
    if (messageEnd) {
      messageEnd.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages.length]);

  useEffect(() => {
    let timer;
    if (isLoading) {
      timer = setTimeout(() => {
        setShowRetryButton(true);
      }, 500);
    } else {
      setShowRetryButton(false);
    }

    return () => clearTimeout(timer);
  }, [isLoading]);

  const handleRetry = () => {
    // Retrieve the game state from sessionStorage
    const savedStateJSON = sessionStorage.getItem("gameState");
    if (!savedStateJSON) {
      console.error("No game state available in sessionStorage.");

      return;
    }

    const savedState = JSON.parse(savedStateJSON);

    // Modify the sessionData as required
    const sessionData = {
      gameId: savedState.gameId,
      opponentId: savedState.opponentId,
      opponentName: savedState.opponentName,
      initialStatus: "GOING"
    };

    // Navigate to the KittyCards page with the modified game session data
    navigate(`/kittycards/${savedState.gameId}`, {
      state: sessionData
    });

    console.log("Navigated with updated session data.");
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        {showRetryButton && (
          <button onClick={handleRetry} className="retry-button">Retry</button>
        )}
      </div>
    );
  }


  const sendChatMessage = () => {
    if (chatInput.trim()) {
      send(`/app/chat/${gameId}`, JSON.stringify({
        message: chatInput,
        senderId: currUser.id,
        receiverId: opponentId,
      }));
      setChatInput("");
    }
  };

  function sendSurrenderConfirmation(gameId) {
    console.log("Sending Surrender confirmation:", gameId, currUser.id);
    send(`/app/game/${gameId}/surrender`,   JSON.stringify({
      playerId:currUser.id,
      surrender:true,
    }) );
  }

  const handleSurrenderClick = () => {
    setShowConfirmModal(true); // Open the modal
  };

  const handleCloseModal = () => {
    setShowConfirmModal(false); // Close the modal
  };

  const confirmSurrender = () => {
    sendSurrenderConfirmation(gameId);
    setShowConfirmModal(false); // Close modal after action
  };


  const renderChatBox = () => (
    <div className="chat-container">
      <div className="message-container" style={{ maxHeight: "500px", overflowY: "auto" }}>
        {chatMessages.map((msg) => (
          <div key={msg.id} className={`message ${msg.senderId === currUser.id ? "self" : ""}`}>
            {msg.senderId === currUser.id ? "You" : msg.senderUsername}: {msg.text}
            {!msg.isTranslated && msg.senderId !== currUser.id && (
              <button className="translate-btn" onClick={() => translateMessage(msg.id, selectedLanguage)}>
                <img src={translateIcon} alt="Translate" />
              </button>
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

  const renderPlayerProfile = (playerName, score) => (
    <div
      className="player-profile"
      style={{
        display: "block",
        width: "80%",
        height: "auto",
      }}>
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

  const renderControls = () => (
    <div className="controls">
      <Button className="full-width" onClick={handleSurrenderClick}>Surrender</Button>
      {showConfirmModal && (
        <Modal isOpen={showConfirmModal} onClose={handleCloseModal}>
          <p>Are you sure you want to surrender?</p>
          <button onClick={confirmSurrender}>Yes</button>
          <button onClick={handleCloseModal}>No</button>
        </Modal>
      )}
    </div>
  );

  return (
    <BaseContainer>
      <div className="game-layout">
        <div className="left-column">
          {renderChatBox()}
          {renderPlayerProfile(username, currentScore)}
        </div>
        <div className="center-column">
          <RenderBoard grid={grid} onCardDrop={handleCardDrop} />
          <RenderHand hand={hand} />
        </div>
        <div className="right-column">
          {renderPlayerProfile(opponentName, opponentScore)}
          <div className="controls">
            {renderControls()}
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

export default KittyCards;