import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from "./AuthContext";
import { api } from '../../helpers/api';
import PropTypes from 'prop-types';
import { LanguageDropdown } from '../ui/LanguageDropdown'

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


        return (
      <ChatContext.Provider value={{ messages, subscribeToChat, sendMessage, translateMessage}}>

             {children}
         </ChatContext.Provider>
    );
};

ChatProvider.propTypes = {
    children: PropTypes.node.isRequired  // Validates that children is a React node and is required
};

export const useChat = () => useContext(ChatContext);

export const translateMessage = async (messages, setMessages, msgId, sourceLanguage = "en", targetLanguage = 'de') => {
    if (Array.isArray(messages)) {
        const msg = messages.find(m => m.id === msgId);
        if (msg) {
            try {
                const response = await api.post('/api/translate/'+targetLanguage, {
                    message: msg.text,
                   sourceLanguage
                });
                const translatedText = response.data.data.translations[0].translatedText;
                const updatedMessages = messages.map(m =>
                    m.id === msgId ? { ...m, text: translatedText } : m
                );
                setMessages(updatedMessages);
            } catch (error) {
                console.error('Translation error:', error);
            }
        }
    } else {
        console.error('messages is not an array');
    }
};



