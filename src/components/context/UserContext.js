import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import BaseContainer from "../ui/BaseContainer";
import { Button } from "../ui/Button";
import { useCurrUser } from '../context/UserContext';
import { api, handleError } from "helpers/api";

const Matchmaking = () => {
  const { currUser } = useCurrUser();  // Retrieves the current user and helper functions from context
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const startQueueing = async () => {
      if (!currUser.token) {
        toast.error("You must be logged in to start matchmaking.");
        navigate('/login');
        return;
      }
      setLoading(true);
      try {
        const response = await api.put(`/games/queue/${currUser.id}`, {}, {
          headers: { Authorization: `Bearer ${currUser.token}` }
        });
        if (response.data.gameId) {
          navigate(`/kittycards/${response.data.gameId}`);
        } else {
          toast.info("Queueing for a match...");
        }
      } catch (error) {
        toast.error(`Error during matchmaking: ${handleError(error)}`);
      } finally {
        setLoading(false);
      }
    };

    startQueueing();

    return () => {
      // Called when the component unmounts
      const doQuitQueueing = async () => {
        if (currUser.id && currUser.token) {
          try {
            await api.delete(`/games/dequeue/${currUser.id}`, {
              headers: { Authorization: `Bearer ${currUser.token}` }
            });
            toast.info("You have left the queue.");
          } catch (error) {
            toast.error(`Error quitting the queue: ${handleError(error)}`);
          }
        }
      };

      doQuitQueueing();
    };
  }, [currUser, navigate]);

  return (
    <BaseContainer>
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Waiting for an opponent...</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <Button onClick={() => {
            // This will trigger the cleanup function via a manual route change
            navigate("/main");
          }}>Cancel Matchmaking</Button>
        )}
      </div>
    </BaseContainer>
  );
};

export default Matchmaking;
