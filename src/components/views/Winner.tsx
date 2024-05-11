import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import {Button} from "components/ui/Button";
import "styles/views/Winner.scss";
import { api, handleError } from "helpers/api";
import { useCurrUser } from "../context/UserContext";
import { toast } from "react-toastify";

const Winner = () => {
  const navigate = useNavigate();
  const { gameId } = useParams();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const { currUser } = useCurrUser();

  useEffect(() => {
    // Ensure the loading state is true when starting the fetch operation
    setLoading(true);


    const fetchResult = async () => {
      console.log("Fetching result for game ID:", gameId);
      try {
        const response = await api.get(`/game/${gameId}/result`, {
          headers: { Authorization: `Bearer ${currUser.token}` }
        });
        if (response.data) {
          setResult(response.data);
        }
      } catch (error) {
        console.error("Error fetching result:", error);
        toast.error("Failed retrieving game result");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [gameId, currUser.id, navigate]);

  const quitNow = () => {
    navigate("/main");
  };

  if (loading) {
    return (
      <BaseContainer className="winner container">
        <p>Loading...</p>
      </BaseContainer>
    );
  }
  if(!loading&&!result){
    return (
      <BaseContainer className="winner container">
        <p>Failed retrieving game result.</p>
        <Button onClick={quitNow}>Return to Home</Button>
      </BaseContainer>
    );
  }

  return (
    <div>
      <h1>Game Results</h1>
      {result.winnerId === currUser.id && (
        <div>
          <h2>Congratulations, you won!</h2>
          <p>Your opponent was {result.loserUsername}.</p>
        </div>
      )}
      {result.loserId === currUser.id && (
        <div>
          <h2>Sorry, you lost!</h2>
          <p>The winner was {result.winnerUsername}.</p>
        </div>
      )}
      {result.loserId !== currUser.id && result.winnerId !== currUser.id && (
        <div>
          <h2>Game Summary</h2>
          <p>Winner: {result.winnerUsername}</p>
          <p>Loser: {result.loserUsername}</p>
        </div>
      )}
      <Button onClick={quitNow}>Return to Home</Button>
    </div>
  );
};

export default Winner;
