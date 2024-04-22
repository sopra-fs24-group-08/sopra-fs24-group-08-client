import React, { createContext, useContext, useState, useCallback } from "react";
import { send, subscribe } from "../../helpers/webSocket"
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';


const MatchmakingContext = createContext();

export const useMatchmaking = () => useContext(MatchmakingContext);

export const MatchmakingProvider = ({ children }) => {
    const [isInMatchmaking, setIsInMatchmaking] = useState(false);
    const navigate = useNavigate();

    const joinMatchmaking = useCallback(() => {
        const userId = localStorage.getItem("id");
        send("matchmaking/join", { userId });
        setIsInMatchmaking(true);
        subscribe(`/user/${userId}/queue/matchmaking`, response => {
            const data = JSON.parse(response.body);
            if (data.status === "matched") {
                setIsInMatchmaking(false);
                navigate(`/kittycards`, { state: { gameId: data.gameId, userId } });
            }
        });
    }, [navigate]);
    MatchmakingProvider.propTypes = {
        children: PropTypes.node.isRequired
    };
    const leaveMatchmaking = useCallback(() => {
        const userId = localStorage.getItem("id");
        send("/matchmaking/leave", { userId });
        setIsInMatchmaking(false);
    }, []);

    return (

        <MatchmakingContext.Provider value={{ isInMatchmaking, joinMatchmaking, leaveMatchmaking }}>
            {children}
        </MatchmakingContext.Provider>
    );

};
export default MatchmakingContext;