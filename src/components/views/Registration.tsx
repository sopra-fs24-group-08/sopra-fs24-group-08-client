import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import {useNavigate} from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Registration.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

const FormField = (props) => {
  return (
    <div className="login field">
      <label className="login label">{props.label}</label>
      <input
        className="login input"
        placeholder="enter here.."
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

const SessionToken = async (requestBody) => {
  try {
    const response = await api.post("/users/authentication/token", requestBody);
    localStorage.setItem("token",response.data);
    api.defaults.headers.common["Authorization"] = localStorage.getItem("token")
  }
  catch (error) {
    alert(
      `Something went wrong during the login: \n${handleError(error)}`
    );
  }};

const Registration = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState<string>(null);
  const [username, setUsername] = useState<string>(null);

  const doRegister = async () => {
    try {
      const requestBody = JSON.stringify({ username, password });
      const response = await api.post("/users", requestBody);
      localStorage.setItem("currUser",JSON.stringify(response.data));
      await new Promise((resolve) => setTimeout(resolve, 1000));

      //Doing it all in 1 call might be more in line with the specifications
      await SessionToken(requestBody);
      navigate("/profiles");
    }
    catch (error) { console.log(error);
      alert(
        `Something went wrong during the login: \n${handleError(error)}`
      );
      setUsername("");
      setPassword("");
      navigate("/registration");
      //redirecting even needed?
    }

  };

  return (
    <BaseContainer>
      <div className="login container">
        <div className="login form">
          <FormField
            label="Choose Username"
            value={username}
            onChange={(un: string) => setUsername(un)}
          />
          <FormField
            label="Choose Password"
            value={password}
            onChange={(n) => setPassword(n)}
          />
          <div className="login button-container">
            <Button
              disabled={!username || !password}
              width="100%"
              onClick={() => doRegister()}
            >
              Register Account
            </Button>
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

export default Registration;
