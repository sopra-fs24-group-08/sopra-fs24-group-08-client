import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import {useNavigate} from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Register.scss";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import {usePolling} from "components/context/PollingContext";
import { useAuth } from "../context/AuthContext";

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
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const { serverRequests, currentUserId, setCurrentUserId  } = usePolling();

  const doRegister = async () => {
    if (!username.trim() || !name.trim() || !password.trim()) {
      alert("Username, name, and password cannot be empty.");
      return;
    }

    setIsSubmitting(true);
    try {
      const requestBody = JSON.stringify({ username, name, password });
      const response = await api.post("/users", requestBody);
      const user = new User(response.data);
      setCurrentUserId(user.id);

      // Log in the user using AuthContext
      login(user, user.token);

      // Navigate to the main area of the application after successful registration and login
      navigate("/navigation");
    } catch (error) {
      alert(`Something went wrong during the registration: \n${handleError(error)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <BaseContainer>
        <div className="register container">
          <div className="register form">
            <FormField label="Username" value={username} onChange={setUsername} />
            <FormField label="Name" value={name} onChange={setName} />
            <FormField label="Password" value={password} onChange={setPassword} />
            <div className="login button-container">
              <Button disabled={!username || !password || !name || isSubmitting} onClick={doRegister}>
                Register
              </Button>
            </div>
          </div>
        </div>
      </BaseContainer>
  );
};

export default Register;