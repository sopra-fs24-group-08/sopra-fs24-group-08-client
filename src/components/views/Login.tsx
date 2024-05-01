import React, { useState } from "react";
import { useCurrUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import "styles/views/Login.scss";
import { Button } from "../ui/Button";
import BaseContainer from "../ui/BaseContainer";
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

function Login() {
  const [password, setPassword] = useState<string>(null);
  const [username, setUsername] = useState<string>(null);
  const { login } = useCurrUser();
  const navigate = useNavigate();

  const doLogin = async ()=> {
    const success = await login(username, password);
    if (success) navigate("/main");

  }
  const handleRegister = () => {
    navigate("/registration"); // Update this with your registration route if different
  };

  return (
    <BaseContainer>
      <div className="login container">
        <div className="login form">
          <FormField
            label="Username"
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
            <Button
              width="100"
              onClick={() => handleRegister()}
            >
              Create a new account
            </Button>
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};



export default Login;
