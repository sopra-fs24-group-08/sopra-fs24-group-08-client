/*
import React, { createContext, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";
import PropTypes from "prop-types";

const MatchmakingContext = createContext();

export const useMatchmaking = () => useContext(MatchmakingContext);

export const MatchmakingProvider = ({ children }) => {
    const { stompClient } = useAuth();

    MatchmakingProvider.propTypes = {
        children: PropTypes.node.isRequired
    };

    useEffect(() => {
        const subscribeToMatchmaking = () => {
            stompClient.subscribe('/user/queue/matchmaking', (message) => {
                const response = JSON.parse(message.body);
                if (response.status === 'matched') {
                    navigate(`/game/${response.gameId}`);
                }
            });
        };

        if (stompClient) {
            subscribeToMatchmaking();
        }

        return () => {
            if (stompClient) {
                stompClient.unsubscribe('/user/queue/matchmaking');
            }
        };
    }, [stompClient, navigate]);

    const joinMatchmaking = () => {
        stompClient.send('/app/matchmaking/join', {}, JSON.stringify({ userId: stompClient.userId }));
    };
/!**!/
    return (
        <MatchmakingContext.Provider value={{ joinMatchmaking }}>
            {children}
        </MatchmakingContext.Provider>
    );
};

export default MatchmakingContext;*/
