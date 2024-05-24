import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import { Button } from "components/ui/Button";
import "styles/views/Winner.scss";
import { api} from "helpers/api";
import { useCurrUser } from "../context/UserContext";
import { toast } from "react-toastify";

const Winner = () => {
  const navigate = useNavigate();
  const { gameId } = useParams();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const { currUser } = useCurrUser();
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        console.log("Fetching result for game ID:", gameId);
        const response = await api.get(`/game/${gameId}/result`, {
          headers: { Authorization: `Bearer ${currUser.token}` }
        });
        if (response.data) {
          setResult(response.data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching result:", error);
        toast.error("Failed retrieving game result. Retrying...");
        if (retryCount < 3) { // Try up to 3 times
          setTimeout(() => {
            setRetryCount(retryCount + 1);
          }, 1000); // Retry after 1 second
        } else {
          setLoading(false); // Stop loading after 3 retries
          toast.error("Failed to load data after several attempts.");
        }
      }
    };

    if (loading) {
      fetchResult();
    }
  }, [gameId, currUser.token, loading, retryCount]);

  const quitNow = () => {
    navigate("/main");
  };

  if (loading) {
    return (
      <BaseContainer className="winner container">
        <div className="spinner"></div>
        <p>Loading game results...</p>
      </BaseContainer>
    );
  }

  if (!result) {
    return (
      <BaseContainer className="winner container">
        <p>Failed retrieving game result after multiple attempts.</p>
        <div className="login button-container">
          <Button onClick={() => setRetryCount(0)}>Try Again</Button>
          <Button onClick={quitNow}>Return to Home</Button>
        </div>
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