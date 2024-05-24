import { useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { useWebSocket } from "../components/context/WebSocketProvider";
import {useCurrUser} from "../components/context/UserContext";
import { useFriend } from "../components/context/FriendContext";


const GlobalGameListener = () => {
  const navigate = useNavigate();
  const { subscribeUser, unsubscribeUser ,send} = useWebSocket();
  const { currUser } = useCurrUser();
  const {isAccepted} = useFriend();


  useEffect(() => {
    const handleGameInvitation = (message) => {
      const data = JSON.parse(message.body);
      console.log(data)
      if (data.matchFound) {
        const sessionData = {
          gameId: data.gameId,
          isFirst: data.isFirst,
          opponentId: data.opponentId,
          opponentName: data.opponentName,
          initialStatus: "STARTING"
        };
        sessionStorage.setItem("gameSessionData", JSON.stringify(sessionData));

        // Navigate to the KittyCards page with the game session data
        navigate(`/kittycards/${data.gameId}`, {
          state: sessionData})
      }
    };
    //"/topic/"+inviterId+"/game-notifications"
    console.log("subscribe: "+ `/topic/${currUser.id}/game-notifications`)
    subscribeUser(`/topic/${currUser.id}/game-notifications`, handleGameInvitation);

    return () => {
      unsubscribeUser(`/topic/${currUser.id}/game-notifications`);
    };
  }, [navigate, currUser.id, isAccepted]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (currUser && currUser.id) {
        // Send a WebSocket message before the window unloads
        send(`/app/${currUser.id}/logout`, "");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [currUser, send]);

  return null;
};

export default GlobalGameListener;
