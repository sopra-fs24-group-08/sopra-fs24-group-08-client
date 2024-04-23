import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { useAuth } from "../context/AuthContext"; // This should be AuthContext

interface ChatProps {
    userId: number;
    gameId?: number;
    recipientId?: number; // Added for private chat
}

const ChatComponent = ({ userId, gameId, recipientId }: ChatProps) => {
    const { websocket } = useAuth(); // useAuth should provide the websocket
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");

    // Determine the chat topic based on gameId or opponentUserId
    let chatTopic;
    if (gameId) {
        chatTopic = `/topic/game/${gameId}`;
    } else if (recipientId) {
        chatTopic = `/user/chat/${recipientId}`;
    }
    useEffect(() => {
        if (websocket.isConnected()) {
            const subscription = websocket.subscribe(chatTopic, (msg) => {
                setMessages(prev => [...prev, JSON.parse(msg.body)]);
            });

            return () => subscription.unsubscribe();
        }
    }, [websocket, chatTopic, gameId, recipientId]);

    const sendMessage = () => {
        const payload = gameId
            ? { from: userId, text: message, gameId }
            : { from: userId, text: message };

        websocket.send(`/app${chatTopic}`, {}, JSON.stringify(payload));
        setMessage("");
    };

    const translateMessage = async (msgId) => {
        const msg = messages.find(m => m.id === msgId);
        if (msg) {
            try {
                const response = await api.post('/translate', {
                    text: msg.text,
                    targetLang: 'de'
                });
                const translatedText = response.data;
                setMessages(messages.map(m => m.id === msgId ? { ...m, text: translatedText } : m));
            } catch (error) {
                console.error('Translation error:', error);
            }
        }
    };

    return (
        <div>
            {/* Using same logic as for Userlist .map */}
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>
                        {msg.from}: {msg.text}
                        <button onClick={() => translateMessage(msg.id)}>Translate</button>
                    </li>
                ))}
            </ul>
            <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default ChatComponent;
