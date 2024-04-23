import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from "./AuthContext";
import { api } from '../../helpers/api';
import PropTypes from 'prop-types';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const { client } = useAuth();
    const [messages, setMessages] = useState([]);

    // Subscribe to a chat channel
    const subscribeToChat = (chatId) => {
        if (!client) {
            console.error("WebSocket client is not connected.");
            return;
        }
        client.subscribe(`/user/queue/${chatId}`, message => {
            const receivedMessage = JSON.parse(message.body);
            console.log("Message received in chat:", receivedMessage);
            setMessages(prevMessages => [...prevMessages, receivedMessage]);
        });
    };

    // Send a message to a chat channel
    const sendMessage = (chatId, message) => {
        if (!client) {
            console.error("WebSocket client is not connected.");
            return;
        }
        client.send(`/app/chat/${chatId}`, {}, JSON.stringify({ message }));
    };

    // Translate a message
    const translateMessage = async (msgId, targetLang = 'de') => {
        const msg = messages.find(m => m.id === msgId);
        if (msg) {
            try {
                const response = await api.post('/translate', {
                    text: msg.text,
                    targetLang
                });
                const translatedText = response.data.translatedText;
                const updatedMessages = messages.map(m =>
                    m.id === msgId ? { ...m, text: translatedText } : m
                );
                setMessages(updatedMessages);
            } catch (error) {
                console.error('Translation error:', error);
            }
        }
    };

        return (
        <ChatContext.Provider value={{ messages, subscribeToChat, sendMessage, translateMessage }}>
            {children}
        </ChatContext.Provider>
    );
};

ChatProvider.propTypes = {
    children: PropTypes.node.isRequired  // Validates that children is a React node and is required
};

export const useChat = () => useContext(ChatContext);
