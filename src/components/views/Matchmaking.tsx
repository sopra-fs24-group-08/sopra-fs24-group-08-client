import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import BaseContainer from "../ui/BaseContainer";
import { Button } from "../ui/Button";
import { useCurrUser } from "../context/UserContext";
import { api, handleError } from "helpers/api";
import "../../styles/views/Game.scss";




const Matchmaking = () => {
  const { currUser } = useCurrUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [ingame, setIngame] = useState(false);

  //Depends on future plan i guess,we need gameId -> to KittyCards view
  // Function to handle queuing process
  const startQueueing = async () => {
    setLoading(true);
    try {
      const response = await api.put(`/games/queue/${currUser.id}`, {}, {
        headers: { Authorization: `Bearer ${currUser.token}` }
      }); //make sure to see first how we will do matchmaking
      if (response.data.gameId) {
        // Navigate to the game view if a game is found
        navigate(`/kittycards/${currUser.id}/${response.data.gameId}`);
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

  const doQuitQueueing = async () => {
    try {
      await api.delete(`/games/dequeue/${currUser.id}`, {
        headers: { Authorization: `Bearer ${currUser.token}` }
      });
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
      navigate("/main")
    }
  };
  useEffect(() => {
    startQueueing();

    return () => {
      doQuitQueueing();
    };
  }, []);


  return (
    <BaseContainer>
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>Waiting for an opponent...</h2>
        <div className="login button-container">
          <Button onClick={doQuitQueueing}>Cancel Matchmaking</Button>
        </div>
      </div>
    </BaseContainer>
);
};

export default Matchmaking;
