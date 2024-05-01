import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BaseContainer from "components/ui/BaseContainer";
import { Button } from "components/ui/Button";
import PropTypes from "prop-types";
import "styles/views/Winner.scss"; // Make sure the styles and types are correctly imported

const Winner = ({ winnerName }) => {
  const navigate = useNavigate();
  const [counter, setCounter] = useState(10);

  useEffect(() => {
    const timer = counter > 0 && setInterval(() => setCounter(counter - 1), 1000);

    if (counter === 0) {
      navigate("/navigation");
    }

    return () => clearInterval(timer);
  }, [counter, navigate]);

  const quitNow = () => {
    navigate("/navigation");
  };

  return (
    <BaseContainer className="winner container">
      <div className="winner content">
        <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "white" }}>The winner is {winnerName}!</h2>
        <p style={{ fontSize: "16px", fontWeight: "300", color: "white" }}>Quit in {counter} seconds</p>
        <Button className="quit-button" onClick={quitNow}>
          Quit Now
        </Button>
      </div>
    </BaseContainer>
  );
};

Winner.propTypes = {
  winnerName: PropTypes.string.isRequired,
};

export default Winner;
