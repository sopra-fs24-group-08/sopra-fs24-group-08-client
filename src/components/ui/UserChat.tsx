import React, { useEffect } from 'react';
import { useChat } from '../context/ChatContext';

const UserChatComponent = ({ chatId }) => {
    const { subscribeToChat, sendMessage } = useChat();

    useEffect(() => {
        // Subscribe to user chat when the component mounts
        subscribeToChat(`users/queue/${chatId}`);

        return () => {
            // Cleanup: unsubscribe from the chat
        };
    }, [chatId, subscribeToChat]);

    return (
        <div>
            <button onClick={() => sendMessage(`users/queue/${chatId}`, "Hello!")}>
                Send Message
            </button>
        </div>
    );
};

export default UserChatComponent;
