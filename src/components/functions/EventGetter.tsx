const subscribeToGameUpdates = (gameId, handleGameEnd) => {
  const eventSource = new EventSource(`http://localhost:8080/stream/${gameId}`);

  eventSource.onopen = function() {
    console.log("Connection to server opened.");
  };
  
  //event.data is what the server send.
  // option 1
  eventSource.addEventListener('GAME_END', function(event) {
    console.log("Game has ended.");
    handleGameEnd();
  });

  eventSource.addEventListener('GAME_BOARD', function(event) {
    console.log("updated game board.");
    
  });

  eventSource.onmessage = function(event) {
    console.log("New event from server:", event.data);
  };

  eventSource.onerror = function(error) {
    console.error("EventSource failed:", error);
    eventSource.close();
  };


  return eventSource;
}

export default subscribeToGameUpdates;
