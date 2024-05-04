import React, { useEffect, useState } from 'react';
import PropTypes from "prop-types";
import { api, handleError } from "helpers/api";
import { useCurrUser } from "../context/UserContext";
import KittyCards from './KittyCards';
import BaseContainer from "../ui/BaseContainer";
import Game from './Game';

export const GameBoard = ({gameId}) => {
  const [gameState, setGameState] = useState(null);
  const { currUser } = useCurrUser();

  useEffect(() => {
    const eventSource = new EventSource(`http://localhost:8080/stream/${gameId}/${currUser.id}`);

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

  const handleGameStateUpdate = async(event) => {
    setGameState(JSON.parse(event.data));
  };

  function renderContent() {
    if (gameState) {
      return <KittyCards gameState={gameState} />;
      // return <KittyCards />;
    }
    return (
      <BaseContainer>
        <div style={{ padding: "20px", textAlign: "center" }}>
          <h2>Loading...</h2>
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

GameBoard.propTypes = {
  gameId: PropTypes.number.isRequired
};
