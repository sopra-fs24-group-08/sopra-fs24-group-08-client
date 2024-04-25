import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import {useNavigate} from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Navigation.scss";
import BaseContainer from "components/ui/BaseContainer";
import Header from "./Header";
import YouTube from "react-youtube";
const Tutorial = () => {

  const navigate = useNavigate();
  const [tutorialId, setTutorialId] = useState("");

  useEffect(() => {
    const playTutorial = async () => {
      try {
        const response = await api.get("/tutorial");
        const tutorialId = response.data;
        console.log(tutorialId);
        setTutorialId(tutorialId);
      } catch (error) {
        alert(
          `Something went wrong during asking for tutorial: \n${handleError(error)}`
        );
      }
    };
    playTutorial();
  }, []);

  return (
    <div>  
      <BaseContainer>
        <Header height="100" />
        <div className="navigation container">
          <YouTube videoId={tutorialId}/>
          <div className="navigation button-container"> 
            <Button
              style={{ width: "100%", marginBottom: "10px" }}
              onClick={() => navigate("/kittycards")}
            >
              Back
            </Button>   
          </div>
        </div>
      </BaseContainer>
    </div>
    
  );
};

export default Tutorial;