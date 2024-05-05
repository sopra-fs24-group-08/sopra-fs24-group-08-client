import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import { Button } from "components/ui/Button";
import "styles/views/Winner.scss";
import { api, handleError } from "helpers/api";
import { useCurrUser } from "../context/UserContext";

const Winner = () => {
  const navigate = useNavigate();
  const { gameId, "*": additionalParams } = useParams();
  const playerName = additionalParams.split("/")[0];
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const { currUser } = useCurrUser();
  const { unsubscribeUser } = useCurrUser();

  useEffect(() => {
    unsubscribeUser(`/topic/game/${gameId}/${currUser.id}`);
    unsubscribeUser(`/topic/chat/${gameId}`)
    const fetchResult = async () => {
      try {
        const response = await api.get(`/game/${gameId}/result/${playerName}`, {},
          { headers: { Authorization: `Bearer ${currUser.token}` ,userId: currUser.id} });
        setResult(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching result:", error);
        setLoading(false);
      }
    };

    fetchResult();
  }, [gameId, playerName]);

  const quitNow = () => {
    navigate("/main");
  };

  return (
    <BaseContainer className="winner container">
      <div className="winner content">
        {loading ? (
          <p>Loading...</p>
        ) : result ? (
          <>
            {result.participated ? (
              <>
                {result.won ? (
                  <h2 className="winner-message">Congratulations, you won!</h2>
                ) : (
                  <h2 className="loser-message">Sorry, you lost. Better luck next time!</h2>
                )}
              </>
            ) : (
              <h2 className="not-participated-message">You did not participate in this game.</h2>
            )}
            <Button className="quit-button" onClick={quitNow}>
              Quit Now
            </Button>
          </>
        ) : (
          <p>No result found.</p>
        )}
      </div>
    </BaseContainer>
  );
};

export default Winner;
