import { React,useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import BaseContainer from "components/ui/BaseContainer";

const emptySlot = null;
const blockedSlot = 'blocked'; // A special marker for the blocked slot

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
  { id: 1, name: 'Card 1' },
  { id: 2, name: 'Card 2' },
  { id: 3, name: 'Card 3' },
];

const KittyCards = () => {
  const [hand, setHand] = useState<Card[]>(initialHand);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [showMessage, setShowMessage] = useState(false);
  const [grid, setGrid] = useState(initialGrid());
  const navigate = useNavigate();


  const selectCardFromHand = (card: Card) => {
    setSelectedCard(card);
  };

  const renderHand = () => (
    <div style={{ display: 'flex' }}>
      {hand.map((card) => (
        <div
          key={card.id}
          style={{ border: '1px solid blue', padding: '10px', margin: '5px', cursor: 'pointer' }}
          onClick={() => selectCardFromHand(card)}
        >
          {card.name}
        </div>
      ))}
    </div>
  );

  // Function to render the grid with blocked and empty slots
  const renderGrid = () => (
    <div style={{ display: 'flex', flexDirection: 'column', margin: '10px' }}>
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: 'flex' }}>
          {row.map((slot, columnIndex) => {
            const isBlocked = slot === blockedSlot;
            const slotStyle = {
              width: '50px',
              height: '50px',
              border: '1px solid black',
              lineHeight: '50px',
              textAlign: 'center',
              backgroundColor: isBlocked ? 'red' : 'white'
            };

            return (
              <div
                key={`${rowIndex}-${columnIndex}`}
                style={slotStyle}
                onClick={() => placeCard(rowIndex, columnIndex)}
              >
                {slot && slot !== blockedSlot ? slot.name : ''}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );

  const placeCard = (rowIndex: number, columnIndex: number) => {
    // Check if a card is selected
    if (!selectedCard) {
      alert('Please select a card first.');
      return;
    }

    // Check if the slot is blocked or already occupied
    if (grid[rowIndex][columnIndex] === blockedSlot || grid[rowIndex][columnIndex]) {
      alert('This slot is not available.');
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
      <div>
        <h2>Select a Card to Play</h2>
        {renderHand()}
        <h2>Game Board</h2>
        {renderGrid()}
        {showMessage && <p>You lose the game!</p>}
        <Button
          width="500px"
          onClick={() => doExit()}>
          Quit
        </Button>
      </div>
    </BaseContainer>
  );
}

export default KittyCards;