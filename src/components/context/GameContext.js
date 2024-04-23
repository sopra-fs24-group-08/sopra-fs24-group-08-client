import React, { createContext, useContext, useEffect ,useState} from "react";
import { useAuth } from "./AuthContext";
import PropTypes from 'prop-types';


const GameContext = createContext();

export const GameProvider = ({ children }) => {
    const { websocket } = useAuth();
    const [gameId, setGameId] = useState(null);
    const [inGame, setInGame] = useState(false);

    useEffect(() => {
        let updatesSub = null;
        let chatSub = null;

        if (websocket.isConnected() && gameId) {
            updatesSub = websocket.subscribe(`/topic/game/${gameId}/updates`, (message) => {
                console.log("Game Update:", message.body);  // Process game update messages here
            });

            chatSub = websocket.subscribe(`/topic/game/${gameId}/chat`, (message) => {
                console.log("Chat Message:", message.body);  // Process chat messages here
            });
            // Set inGame status to true when subscribed to a game to avoid getting invited to a game
            setInGame(true)
        }

        return () => {
            if (updatesSub) {
                websocket.unsubscribe(updatesSub);
            }
            if (chatSub) {
                websocket.unsubscribe(chatSub);
            }
            setInGame(false); //Allow invites again
        };
    }, [websocket, gameId]);

    const sendMove = (move) => {
        if (websocket.isConnected() && gameId) {
            websocket.send(`/app/game/${gameId}/move`, {}, JSON.stringify(move));
        }
    };

    const sendMessage = (chatMessage) => {
        if (websocket.isConnected() && gameId) {
            websocket.send(`/app/game/${gameId}/chat`, {}, JSON.stringify(chatMessage));
        }
    };

    const updateGameId = (id) => {
        setGameId(id);
        setInGame(id !== null)
        //another check for ingame-status
    };

    return (
        <GameContext.Provider value={{ sendMove, sendMessage, updateGameId, gameId, inGame}}>
            {children}
        </GameContext.Provider>
    );
};

GameProvider.propTypes = {
    gameId: PropTypes.string.isRequired,  // Assuming gameId is a string and required
    children: PropTypes.node.isRequired  // Validates that children is a React node and is required
};

export const useGame = () => useContext(GameContext);

