import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import BaseContainer from "components/ui/BaseContainer";
import "../../styles/views/KittyCards.scss";
import SendMessage from "components/SendMessage"; // Importiere die SendMessage-Komponente
import Messages from "components/Messages";

const emptySlot = null;
const blockedSlot = "blocked"; // A special marker for the blocked slot

// Initialize a 3x3 grid where the center is a blocked slot
const initialGrid = () => [
  [emptySlot, emptySlot, emptySlot],
  [emptySlot, blockedSlot, emptySlot],
  [emptySlot, emptySlot, emptySlot]
];

interface Card {
  id: number;
  name: string;
}

// Initial set of cards in the player's hand
const initialHand: Card[] = [
  { id: 1, name: "Card 1" },
  { id: 2, name: "Card 2" },
  { id: 3, name: "Card 3" },
  { id: 4, name: "Card 4" },
  { id: 5, name: "Card 5" },
  { id: 6, name: "Card 6" },
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
      <SendMessage /> {/* Rendere die SendMessage-Komponente */}
      <Messages /> {/* Rendere die Messages-Komponente */}
      {chatMessages.map((message) => (
        <div key={message.id} className={`message ${message.author === "John" ? "self" : ""}`}>
          <span className="message-author">{message.author}: </span>
          {message.text}
        </div>
      ))}
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
  );

  const renderGameBoard = () => {
    return (
      <div className="game-board">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="game-board-row">
            {row.map((slot, columnIndex) => {
              let slotClasses = "game-board-slot";
              if (rowIndex === 1 && columnIndex === 1) {
                slotClasses += " game-board-center"; // Add a class for styling or identification
              }

              return (
                <div
                  key={`${rowIndex}-${columnIndex}`}
                  className={slotClasses}
                  onClick={() => placeCard(rowIndex, columnIndex)}
                >
                  {/* content for each slot, e.g., a card or empty slot */}
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
  const renderPlayerProfile = (color, playerName, score) => (
    <div className="player-profile">
      <div className={`player-avatar ${color}`}></div>
      <div className="player-name">{playerName}</div>
      <div className="player-score">score: {score}</div>
    </div>
  );

  const selectCardFromHand = (card: Card) => {
    setSelectedCard(card);
  };

  const renderHand = () => (
    <div style={{ display: "flex" }}>
      {hand.map((card: Card) => (
        <div
          key={card.id}
          className="card"
          onClick={() => selectCardFromHand(card)}
        >
          {card.name}
        </div>
      ))}
    </div>
  );

  const drawCard = () => {
    const newCardId = Math.max(...hand.map(c => c.id)) + 1; // Get the next ID
    const newCard = { id: newCardId, name: `Card ${newCardId}` };

    // Update the hand state to include the new card
    setHand(hand.concat(newCard));
  };

  const placeCard = (rowIndex: number, columnIndex: number) => {
    // Check if the center slot is clicked, if so draw a card
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
          {renderChatBox()}
          {/* Player's avatar and score here if needed */}
          {renderPlayerProfile("blue", "John S", 18)}
        </div>

        {/* Center column for the game board */}
        <div className="center-column">
          {renderGameBoard()}
        </div>
        {/* Opponent info and controls */}
        <div className="right-column">
          {renderPlayerProfile("red", "Jane W", 28)}
          <div className="controls">
            <Button className="hint-btn">Hint</Button>
            <Button className="surrender-btn">Surrender</Button>
            <Button className="exit-btn" onClick={() => doExit()}>Exit</Button>
          </div>
        </div>
      </div>
      {/* Render the hand of card s */}
      <div className="hand-of-cards">
        {renderHand()}
      </div>
    </BaseContainer>
  );
};

export default KittyCards;
