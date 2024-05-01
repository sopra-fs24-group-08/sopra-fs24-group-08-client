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
export const translateMessage = async (messages, setMessages, msgId, sourceLang = "en", targetLang = 'de') => {
    if (Array.isArray(messages)) {
        const msg = messages.find(m => m.id === msgId);
        if (msg) {
            try {
                const response = await api.post('/api/translate/'+targetLang, {
                    message: msg.text,
                   sourceLang
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



export const LanguageDropdown = ({ languageType }) => {
           const [languages, setLanguages] = useState([]);
           const [searchTerm, setSearchTerm] = useState('');

           useEffect(() => {
               fetchLanguages();
           }, []);

           const fetchLanguages = async () => {
               try {
                   const response = await fetch("https://translation.googleapis.com/language/translate/v2/languages?key=AIzaSyBa6V3OcgeYaX-r1w8ilrrN3HqZ6JKXZZY");
                   const data = await response.json();
                   const languageList = data.data.languages.map(language => ({
                       language: language.language,
                       name: language.language
                   }));
                   setLanguages(languageList);
               } catch (error) {
                   console.error("Fehler beim Abrufen der Sprachen:", error);
               }
           };

           const handleSearch = (e) => {
               const searchTerm = e.target.value.toLowerCase();
               setSearchTerm(searchTerm);
           };

           const filteredLanguages = languages.filter((language) => {
               const languageName = language.name.toLowerCase();
               return languageName.includes(searchTerm);
           });

           const handleLanguageChange = (e) => {
               const selectedLanguage = e.target.value;
               if (languageType === 'source') {
                   setSourceLanguage(selectedLanguage);
               } else if (languageType === 'target') {
                   setTargetLanguage(selectedLanguage);
               }
           };

           return (
               <div>
                   <h3>{languageType === 'source' ? 'Ausgangssprache:' : 'Zielsprache:'}</h3>
                   <input
                       type="text"
                       placeholder="Sprachen suchen..."
                       value={searchTerm}
                       onChange={handleSearch}
                   />
                   <select onChange={handleLanguageChange}>
                       {filteredLanguages.map((language) => (
                           <option key={language.language} value={language.language}>
                               {language.name}
                           </option>
                       ))}
                   </select>
               </div>
           );
       };

       LanguageDropdown.propTypes = {
           languageType: PropTypes.oneOf(['source', 'target']).isRequired
       };