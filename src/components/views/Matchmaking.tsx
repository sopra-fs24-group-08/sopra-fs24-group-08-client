import React, { useContext, useEffect, useState } from "react";
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
  const [isMatched, setIsMatched] = useState(false);
  const { currUser } = useCurrUser();
  const navigate = useNavigate();

  useEffect(() => {
    const matchmakingTopic = `/topic/matchmaking/${currUser.id}`;
    const handleMessage = (message) => {
      const data = JSON.parse(message.body);
      if (data.matchFound) {
        setLoading(true);
        setIsMatched(true);
        navigate(`/kittycards/${data.gameId}`, { state: { gameId: data.gameId, isFirst: data.isFirst, opponentId: data.opponentId } });
      } else {
        toast.info("Waiting for an opponent...");
      }
    };

    // Subscribe to the topic
    subscribeUser(matchmakingTopic, handleMessage);
    // Join the matchmaking queue
    send(`/app/matchmaking/join/${currUser.id}`, '');

    return () => {
      // Cleanup function to unsubscribe and leave the matchmaking queue
      unsubscribeUser(matchmakingTopic);
      if (!isMatched) {
        send(`/app/matchmaking/leave/${currUser.id}`, '');
      }
    };
  }, [currUser, navigate, send, subscribeUser, unsubscribeUser, isMatched]);

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
