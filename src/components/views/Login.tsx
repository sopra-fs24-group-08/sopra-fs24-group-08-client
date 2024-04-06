import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import {useNavigate} from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
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

// Example usage
const SessionToken = async (requestBody) => {
  try {
    const response = await api.post("/users/authentication/token", requestBody)
    localStorage.setItem("token",response.data);
    api.defaults.headers.common["Authorization"] = localStorage.getItem("token")
  }
  catch (error) {
    alert(
      `Something went wrong during the login: \n${handleError(error)}`
    );
  }};
const Login = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState<string>(null);
  const [username, setUsername] = useState<string>(null);

  const doRegister = () =>{
    navigate("/registration")
  }

  const doLogin = async () => {
    try {
      const requestBody = JSON.stringify({ username, password });
      const response = await api.post("/users/authentication/login",requestBody,)
      const user = JSON.stringify(response.data)
      localStorage.setItem("currUser",user);
      //Doing it all in 1 call might be more in line with the specifications
      SessionToken(requestBody);
      navigate("/profiles");
    } catch (error) {
      alert(
        `Something went wrong during the login: \n${handleError(error)}`
      );

    }
  };

  return (
    <BaseContainer>
      <div className="login container">
        <div className="login form">
          <FormField
            label="UsernameTested"
            value={username}
            onChange={(un: string) => setUsername(un)}
          />
          <FormField
            label="Password"
            value={password}
            onChange={(n) => setPassword(n)}
          />
          <div className="login button-container">
            <Button
              disabled={!username || !password}
              width="100%"
              onClick={() => doLogin()}
            >
              Login
            </Button>
          </div>
        </div>
      </div>
      <div className="login button-container-re">
        <Button
          width="100"
          onClick={() => doRegister()}
        >
              Create a new account
        </Button>

      </div>
    </BaseContainer>
  );
};

/**
 * You can get access to the history object's properties via the useLocation, useNavigate, useParams, ... hooks.
 */
export default Login;
