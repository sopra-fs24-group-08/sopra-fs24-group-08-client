import React, { useEffect, useState } from "react";
import { api, handleError } from "helpers/api";
import { useWebSocket } from "../../helpers/webSocket"

interface ChatProps {
    userId: number;
    gameId?: number;
}

const ChatComponent = ({ userId, gameId }: ChatProps) => {
    const { connect, disconnect, subscribe, send } = useWebSocket();
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [isConnected, setConnected] = useState(false);
    const chatTopic = gameId ? `/topic/game/${gameId}` : `/user/${userId}/private`;

    useEffect(() => {
        connect((status) => {
            if (status) {
                setConnected(true);
                subscribe(chatTopic, (msg) => {
                    setMessages(prev => [...prev, JSON.parse(msg.body)]);
                });
            }
        });

        return () => {
            if (isConnected) {
                disconnect();
                setConnected(false);
            }
        };
    }, [userId, gameId, chatTopic]);

    const sendMessage = () => {
        if (isConnected) {
            send(chatTopic, { from: userId, text: message, gameId });
            setMessage("");
        }
    };

    const translateMessage = async (msgId) => {
        const msg = messages.find(m => m.id === msgId);
        if (msg && isConnected) {
            try {
                const response = await api.post('/translate', {
                    text: msg.text,
                    targetLang: 'de'
                });
                const translatedText = response.data;
                const updatedMessages = messages.map(m => m.id === msgId ? { ...m, text: translatedText } : m);
                setMessages(updatedMessages);
            } catch (error) {
                console.error('Translation error:', error);
            }
        }
    };

    return (
        <div>
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>
                        {msg.text}
                        <button onClick={() => translateMessage(msg.id)}>Translate</button>
                    </li>
                ))}
            </ul>
            <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message here..."
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default ChatComponent;
