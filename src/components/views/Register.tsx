import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import {useNavigate} from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Register.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import {usePolling} from "components/context/PollingContext";
import Header from "./Header";

const FormField = (props) => {
  return (
    <div className="login field">
      <label className="login label">{props.label}</label>
      <input
        className="login input"
        placeholder={props.placeholder}
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
  placeholder: PropTypes.string,
};

const Register = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState<string>(null);
  const [name, setName] = useState(null);
  const [username, setUsername] = useState<string>(null);
  const { serverRequests, currentUserId, setCurrentUserId  } = usePolling();

  const doRegister = async () => {
    if (!username || username.trim() === "" ||
      !name || name.trim() === "" ||
      !password || password.trim() === "") {
      alert("Username, name, and password cannot be empty.");

      return;
    }
    try {
      const requestBody = JSON.stringify({ username, name, password });
      const response = await api.post("/users", requestBody);

      // Get the returned user and update a new object.
      const user = new User(response.data);

      // Store the token into the local storage.
      localStorage.setItem("token", user.token);
      localStorage.setItem("id", user.id);
      setCurrentUserId(user.id);

      // Login successfully worked --> navigate to the route /game in the GameRouter
      navigate("/navigation");
    } catch (error) {
      alert(
        `Something went wrong during the register: \n${handleError(error)}`
      );
    }
  };

  return (
    <BaseContainer>
      <Header height="100" />
      <div className="register container">
        <div className="register form">
          <FormField
            placeholder = "username"
            value={username}
            onChange={(un: string) => setUsername(un)}
          />
          <FormField
            placeholder = "name"
            value={name}
            onChange={(un: string) => setName(un)}
          />
          <FormField
            placeholder = "password"
            value={password}
            onChange={(n) => setPassword(n)}
          />
          <div className="login button-container">
            <Button
              disabled={!username || !password || !name}
              width="100%"
              onClick={() => doRegister()}
            >
              Register
            </Button>
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

export default Register;