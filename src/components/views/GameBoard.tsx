import React, { useEffect, useState } from 'react';
import PropTypes from "prop-types";

export const GameBoard = ({gameId, myId}) => {
  const [gameState, setGameState] = useState(null);

  useEffect(() => {
    const eventSource = new EventSource(`http://localhost:8080/stream/${gameId}/${myId}`);

    eventSource.onopen = function() {
      console.log("Connection to server opened.");
    };
    
    eventSource.addEventListener('GAME_STATE', function(event: MessageEvent) {
      console.log("get game state.");
      console.log(event.data);
      handleGameStateUpdate(event);
    });  
  
    eventSource.onmessage = function(event) {
      console.log("New event from server:", event.data);
    };
  
    eventSource.onerror = function(error) {
      console.error("EventSource failed:", error);
      eventSource.close();
    };

    return () => {
      eventSource.removeEventListener('GAME_STATE', handleGameStateUpdate);
      eventSource.close();
    };
  }, []);

  const handleGameStateUpdate = (event) => {
    const newGameState = JSON.parse(event.data);
    setGameState(newGameState);
  };

  return (
    <div>
      {(
        <div>
          <h1>Game Board</h1>
        </div>
      )}
    </div>
  );
};

GameBoard.propTypes = {
  gameId: PropTypes.number.isRequired,
  myId: PropTypes.number.isRequired,
};

export default GameBoard;
