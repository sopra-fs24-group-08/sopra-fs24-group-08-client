import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import BaseContainer from "../ui/BaseContainer";
import { Button } from "../ui/Button";
import { useAuth } from '../context/AuthContext';

const Matchmaking = () => {
    const { websocket } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        let matchmakingSubscription;
        let turnDecisionSubscription;

        // Function to join matchmaking
        const joinMatchmaking = () => {
            websocket.send('/app/matchmaking/join', {}, {});
            toast.info("Looking for a match...")

        };

        if (websocket.isConnected()) {
            matchmakingSubscription = websocket.subscribe('/user/queue/matchmaking', (message) => {
                const { status, gameId } = JSON.parse(message.body);
                if (status === 'matched') {
                    toast.dismiss();
                    toast.success("Match found!");

                    // Unsubscribe from matchmaking updates
                    matchmakingSubscription.unsubscribe();

                    // Now, listen for the turn decision message from the server
                    turnDecisionSubscription = websocket.subscribe(`/user/queue/game/${gameId}/turn-decision`, (decisionMessage) => {
                        const decisionData = JSON.parse(decisionMessage.body);
                        toast.info(decisionData.message, { autoClose: 5000 });


                        // After handling the decision, navigate to the game
                        navigate(`/kittycards/${gameId}`);
                    });

                    // Indicate joining the game
                    websocket.send(`/app/game/${gameId}/join`, {});
                }
            });

            // Call joinMatchmaking when the component is mounted
            joinMatchmaking();
        }

        return () => {
            // Clean up both subscriptions
            if (matchmakingSubscription) {
                matchmakingSubscription.unsubscribe();
            }
            if (turnDecisionSubscription) {
                turnDecisionSubscription.unsubscribe();
            }
        };
    }, [websocket, navigate]);

    return (
        <BaseContainer>
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h2>Waiting for an opponent...</h2>
                <Button onClick={() => navigate("/navigation")}>Cancel</Button>
            </div>
        </BaseContainer>
    );
};

export default Matchmaking;
