import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import BaseContainer from "../ui/BaseContainer";
import { Button } from "../ui/Button";
import { useCurrUser } from '../context/UserContext';
import { api, handleError } from "helpers/api";

const Matchmaking = () => {
  const { currUser } = useCurrUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Function to handle queuing process
  const startQueueing = async () => {
    setLoading(true);
    try {
      const response = await api.put(`/games/queue/${currUser.id}`, {}, {
        headers: { Authorization: `Bearer ${currUser.token}` }
      });
      if (response.data.gameId) {
        // Navigate to the game view if a game is found
        navigate(`/kittycards/${response.data.gameId}`);
      } else {
        toast.info("No match found, still waiting...");
      }
    } catch (error) {
      handleError(error);
      toast.error("Error while trying to find a match.");
      doQuitQueueing();
    } finally {
      setLoading(false);
    }
  };

  // Function to handle unqueuing process
  const doQuitQueueing = async () => {
    try {
      await api.delete(`/games/dequeue/${currUser.id}`, {
        headers: { Authorization: `Bearer ${currUser.token}` }
      });
      toast.info("You have left the queue.");
    } catch (error) {
      handleError(error);
      toast.error("Error while trying to quit the queue.");
    } finally {
      setLoading(false);
    }
  };

  // Effect hook for starting the queueing when the component mounts
  useEffect(() => {
    startQueueing();

    // Cleanup function to call when the component unmounts or if the dependencies change
    return () => {
      doQuitQueueing();
    };
  }, []);

  return (
    <BaseContainer>
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Waiting for an opponent...</h2>
        <Button onClick={doQuitQueueing}>Cancel Matchmaking</Button>
      </div>
    </BaseContainer>
  );
};

export default Matchmaking;
