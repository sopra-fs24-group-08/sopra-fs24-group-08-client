import React, { useState } from "react";
import { api, handleError } from "helpers/api";
import User from "models/User";
import { useNavigate } from "react-router-dom";
import { Button } from "components/ui/Button";
import BaseContainer from "components/ui/BaseContainer";
import FormField from "../ui/FormField";
import "styles/views/Login.scss";
import { connect } from "../../helpers/webSocket";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { auth, setAuth } = useAuth();

  const doLogin = async () => {
    try {
      const requestBody = JSON.stringify({ username, password });
      const response = await api.post("/login", requestBody);

      // Assuming the response will have a token and a user id
      const user = new User(response.data);

      // Store the token and user ID in local storage
      localStorage.setItem("token", user.token);
      localStorage.setItem("id", user.id);
      setAuth({ token: user.token, isConnected: true });

      // Establish WebSocket connection

        // Navigate to the main area of the application after a successful connection
      navigate("/navigation");

    } catch (error) {
      alert(`Something went wrong during the login: \n${handleError(error)}`);
    }
  };

  return (
      <BaseContainer>
        <div className="login container">
          <div className="login form">
            <FormField
                label="Username"
                value={username}
                onChange={setUsername}
            />
            <FormField
                label="Password"
                value={password}
                onChange={setPassword}
            />
            <div className="login button-container">
              <Button
                  disabled={!username || !password}
                  onClick={doLogin}
              >
                Login
              </Button>
              <Button
                  onClick={() => navigate("/register")}
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
