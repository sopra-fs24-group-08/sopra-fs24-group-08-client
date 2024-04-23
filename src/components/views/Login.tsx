import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Login.scss";
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


const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const doLogin = async () => {
    try {
      const requestBody = JSON.stringify({ username, password });
      const response = await api.post("/login", requestBody);
      const user = new User(response.data);
      login(user);
      navigate("/navigation");
    } catch (error) {
      alert(`Something went wrong during the login: \n${handleError(error)}`);
    }
  };
  const navigateToRegister = () => {
    navigate("/register");
  };
  return (
      <BaseContainer>
        <Header height="100" />
        <div className="login container">
          <div className="login form">
            <FormField
                placeholder = "username"
                value={username}
                onChange={(un: string) => setUsername(un)}
            />
            <FormField
                placeholder = "password"
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
            <div className="register button-container">
              <Button
                  width="100%"
                  onClick={navigateToRegister}
              >
                Register
              </Button>
            </div>
          </div>
        </div>
      </BaseContainer>
  );
};

export default Login;
