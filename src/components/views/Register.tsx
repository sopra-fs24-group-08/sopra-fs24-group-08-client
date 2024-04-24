import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Register.scss";
import PropTypes from "prop-types";
import { useAuth } from "../context/AuthContext";
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
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();  // Directly use login from AuthContext, WebSocket handled internally

  const doRegister = async () => {
    try {
      const requestBody = JSON.stringify({ username, name, password });
      const response = await api.post("/users", requestBody);
      const user = new User(response.data); // Assuming 'User' correctly processes the response
      console.log(user)
      login(user);  // Login and WebSocket connection managed inside AuthProvider
      navigate("/navigation");  // Redirect on successful registration
    } catch (error) {
      alert(`Something went wrong during the registration: \n${handleError(error)}`);
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
