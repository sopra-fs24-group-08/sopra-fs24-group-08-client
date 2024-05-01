import React, { useState } from "react";
import User from "models/User";
import {useNavigate} from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Register.scss";
import BaseContainer from "components/ui/BaseContainer";
import { useCurrUser } from "../context/UserContext";
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

function Registration() {
  const [password, setPassword] = useState<string>(null);
  const [username, setUsername] = useState<string>(null);
  const { register } = useCurrUser();
  const navigate = useNavigate();

  const doRegister = async () => {
    const success = await register(username, password);
    if (success) {
      navigate("/main");
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