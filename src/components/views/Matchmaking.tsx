import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import BaseContainer from "../ui/BaseContainer";
import { Button } from "../ui/Button";
import { useCurrUser } from "../context/UserContext";
import "../../styles/views/Game.scss";
import { WebSocketContext } from "../context/WebSocketProvider";

const Matchmaking = () => {
  const { send, subscribeUser, unsubscribeUser } = useContext(WebSocketContext);
  const [loading, setLoading] = useState(false);
  const matchedRef = useRef(false);  // Using a ref to track matchmaking status
  const { currUser } = useCurrUser();
  const navigate = useNavigate();

  useEffect(() => {
    const matchmakingTopic = `/topic/matchmaking/${currUser.id}`;
    subscribeUser(matchmakingTopic, (message) => {
      const data = JSON.parse(message.body);
      if (data.matchFound) {
        setLoading(true);
        matchedRef.current = true;
        const sessionData = {
          gameId: data.gameId,
          isFirst: data.isFirst,
          opponentId: data.opponentId,
          opponentName: data.opponentName,
          initialStatus: "STARTING"
        };

        // Navigate to the KittyCards page with the game session data
        navigate(`/kittycards/${data.gameId}`, {
          state: sessionData})
      } else {
        toast.info("Waiting for an opponent...");
      }
    });
    send(`/app/matchmaking/join/${currUser.id}`, "");

    // Cleanup function to unsubscribe and leave the matchmaking queue on unmount

    return () => {
      unsubscribeUser(matchmakingTopic);
      if (!matchedRef.current && !loading)
        send(`/app/matchmaking/leave/${currUser.id}`, "");
    };
  }, [currUser, navigate, send, subscribeUser, unsubscribeUser]);
  const doQuitQueueing = () => {
    setLoading(false);
    matchedRef.current = false;  // Reset the ref if the user manually cancels matchmaking
    send(`/app/matchmaking/leave/${currUser.id}`, "");
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