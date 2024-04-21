import { React,useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import BaseContainer from "components/ui/BaseContainer";
import {WebSocketProvider} from "../../context/WebSocketContext";
import Messages from "components/Messages";
import SendMessage from "components/SendMessage";

const KittyCards = () => {
  const [showMessage, setShowMessage] = useState(false);
  const navigate = useNavigate();

  const doExit = () => {

    setShowMessage(true);

    setTimeout(() => {
      navigate("/navigation");
    }, 2000); //
  };

  return (
    <BaseContainer>
      <div>
        {showMessage && <p>You lose the game!</p>}
        <Button
          width="500px"
          onClick={() => doExit()}>
          Quit
        </Button>
        <WebSocketProvider>
        <div className="chat-box">
            <SendMessage />
            <Messages />
          </div>
        </WebSocketProvider>

      </div>
    </BaseContainer>
  );
}

export default KittyCards;