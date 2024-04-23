import React, { useEffect } from 'react';
import { useChat } from '../context/ChatContext';

const GameComponent = ({ gameId }) => {
    const { subscribeToChat, sendMessage } = useChat();

    useEffect(() => {
        subscribeToChat(`game/${gameId}/chat`);

        return () => {

        };
    }, [gameId, subscribeToChat]);

    return (
        <div>
            <button onClick={() => sendMessage(`game/${gameId}/chat`, "Hello my Opponent")}>
                Send Message
            </button>
        </div>
    );
};

export default GameComponent;
