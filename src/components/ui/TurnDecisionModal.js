/*
import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { subscribe } from "../../helpers/webSocket";  // Update this path

const TurnDecisionModal = ({ userId }) => {
    const [show, setShow] = useState(false);
    const [gameId, setGameId] = useState(null);

    useEffect(() => {
        const subscription = subscribe(`/user/${userId}/queue/turn-decision`, (message) => {
            const data = JSON.parse(message.body);
            setGameId(data.gameId);
            setShow(true);
        });

        return () => subscription.unsubscribe(); // Cleanup subscription on unmount
    }, [userId]);

    const handleDecision = (decision) => {
        // Send the decision to the server, e.g., via WebSocket
        // send('/path/to/send/decision', { userId, gameId, decision });
        console.log(`Decision: ${decision} for game ID: ${gameId}`);
        setShow(false); // Close the modal
    };

    return (
        <Modal show={show} onHide={() => setShow(false)} centered>
            <Modal.Header closeButton>
                <Modal.Title>Choose Your Turn</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Do you want to go first in the game?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => handleDecision('No')}>
                    No
                </Button>
                <Button variant="primary" onClick={() => handleDecision('Yes')}>
                    Yes
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default TurnDecisionModal;
*/
