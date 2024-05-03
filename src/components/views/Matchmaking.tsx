import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import BaseContainer from "../ui/BaseContainer";
import { Button } from "../ui/Button";
import { useCurrUser } from "../context/UserContext";
import "../../styles/views/Game.scss";
import {WebSocketContext} from "../context/WebSocketProvider";

const Matchmaking = () => {
  const { send, subscribeUser, unsubscribeUser } = useContext(WebSocketContext);
  const [loading, setLoading] = useState(false);
  const { currUser } = useCurrUser();
  const navigate = useNavigate();


  useEffect(() => {
    const matchmakingTopic = `/topic/matchmaking/${currUser.id}`;
    subscribeUser(matchmakingTopic, (message) => {
      const data = JSON.parse(message.body);
      if (data.matchFound) {
        setLoading(true);

        navigate(`/kittycards/${data.gameId}`, { state: { gameId: data.gameId, isFirst: data.isFirst, opponentId: data.opponentId } });
      } else {
        toast.info("Waiting for an opponent...");
      }
    });
// Automatically try to join the matchmaking queue
    send(`/app/matchmaking/join/${currUser.id}`, '');

    // Cleanup function to unsubscribe and leave the matchmaking queue on unmount
    return () => {
      unsubscribeUser(matchmakingTopic);
      send(`/app/matchmaking/leave/${currUser.id}`, '');
    };
  }, [currUser, navigate, send, subscribeUser, unsubscribeUser]);


  //Depends on future plan i guess,we need gameId -> to KittyCards view
  // Function to handle queuing process
  const doQuitQueueing = () => {
    setLoading(false);
    send(`/app/matchmaking/leave/${currUser.id}`, '');
    navigate("/main");
  };


  return (
    <BaseContainer>
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>Waiting for an opponent...</h2>
        <div className="login button-container">
          <Button onClick={doQuitQueueing} disabled={loading}>Cancel Matchmaking</Button>
        </div>
      </div>
    </BaseContainer>
  );
};

export default Matchmaking;
