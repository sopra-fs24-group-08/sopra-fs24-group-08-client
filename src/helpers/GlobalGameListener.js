import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useWebSocket } from "../components/context/WebSocketProvider";
import {useCurrUser} from "../components/context/UserContext";
import { useFriend } from "../components/context/FriendContext";


const GlobalGameListener = () => {
  const navigate = useNavigate();
  const { subscribeUser, unsubscribeUser } = useWebSocket();
  const { currUser } = useCurrUser();
  const {isAccepted} = useFriend();


  useEffect(() => {
    const handleGameInvitation = (message) => {
      const data = JSON.parse(message.body);
      console.log(data)
      if (data.matchFound) {
        navigate(`/kittycards/${data.gameId}`, {
          state: {
            gameId: data.gameId,
            isFirst: data.isFirst,
            opponentId: data.opponentId,
            opponentName: data.opponentName,
          }
        });
      }
    };
    //"/topic/"+inviterId+"/game-notifications"
    subscribeUser(`/topic/${currUser.id}/game-notifications`, handleGameInvitation);
    return () => {
      unsubscribeUser(`/topic/${currUser.id}/game-notifications`);
    };
  }, [navigate, currUser.id, isAccepted]);
}

export default GlobalGameListener;
