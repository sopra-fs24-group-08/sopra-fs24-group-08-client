import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import {useNavigate} from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Register.scss";
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

const Register = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState<string>(null);
  const [name, setName] = useState(null);
  const [username, setUsername] = useState<string>(null);

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
      <div className="register container">
        <div className="register form">
          <FormField
            label="Username"
            value={username}
            onChange={(un: string) => setUsername(un)}
          />
          <FormField
            label="Name"
            value={name}
            onChange={(un: string) => setName(un)}
          />
          <FormField
            label="Password"
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