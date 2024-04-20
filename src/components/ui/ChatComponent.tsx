import React, { useState, useEffect } from "react";
import { connect, subscribe, sendGameMessage, sendPrivateMessage, disconnect, translateMessage } from "../../helpers/webSocket";

const ChatComponent = ({ userId, gameId = null }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [recipientId, setRecipientId] = useState(null);
    const [language, setLanguage] = useState("en");  // Default language

    useEffect(() => {
        connect(() => {
            const chatTopic = gameId ? `/topic/game/${gameId}` : `/queue/private/${userId}`;
            subscribe(chatTopic, (msg) => {
                handleMessage(msg);
            });

            return () => {
                disconnect();
            };
        });

    }, [userId, gameId, recipientId]);

    const handleMessage = (msg) => {
        const parsedMessage = JSON.parse(msg.body);
        setMessages(prevMessages => [...prevMessages, parsedMessage]);
    };

    const sendMessage = () => {
        const chatMessage = {
            content: message,
            userId: userId,
            gameId: gameId
        };

        if (gameId) {
            sendGameMessage(gameId, chatMessage);
        } else if (recipientId) {
            sendPrivateMessage(recipientId, chatMessage);
        }
        setMessage("");
    };

    const requestTranslation = (msg, index) => {
        translateMessage(msg.userId, {...msg, targetLang: language}).then(translatedMessage => {
            const updatedMessages = messages.map((item, idx) => {
                if (idx === index) {
                    return {...item, content: translatedMessage};
                }
                return item;
            });
            setMessages(updatedMessages);
        }).catch(error => {
            console.error("Translation error:", error);
        });
    };

    return (
        <div>
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>
                        {msg.content}
                        {msg.userId !== userId && (
                            <button onClick={() => requestTranslation(msg, index)}>Translate</button>
                        )}
                    </li>
                ))}
            </ul>
            <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Send a message here..."
            />
            <button onClick={sendMessage}>Send</button>
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="de">German</option>
            </select>
        </div>
    );
};

export default ChatComponent;
