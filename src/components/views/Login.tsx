import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { api, handleError } from "helpers/api";
import User from "models/User";
import { Button } from "components/ui/Button";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import  { getDomain }  from "helpers/getDomain";

// Define your WebSocket URL


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

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");

  const doLogin = async () => {
    try {
      const requestBody = JSON.stringify({ username, name });
      const response = await api.post("/users", requestBody);

      // Use the returned user data as needed
      const user = new User(response.data);
      localStorage.setItem("token",user.token)

      // Login successful, now establish WebSocket connection
      const WEBSOCKET_URL = "http://localhost:8080/ws";
      //const protocol = window.location.protocol;
      //console.log(protocol)
      //const running_domain = getDomain().split("//")[1];
      //console.log(running_domain)
      //currently only localhost.
      //const WEBSOCKET_URL = new WebSocket(`${protocol === "https:" ? : "http:" : "wss:" : "ws:"}//${running_domain}/ws`);
      const socket = new SockJS(WEBSOCKET_URL);
      const stompClient = Stomp.over(socket);
      stompClient.connect({}, (frame) => {
        console.log("Connected to WebSocket", frame);

        // Subscribe to a topic to listen for messages
        stompClient.subscribe('/topic/greetings', (greeting) => {
          alert(greeting.body);
          console.log("Received message:", greeting.body);
        });

        sendMessage(stompClient)
        // Optionally, send a message or perform other actions here
      });

      // Navigate to another route upon successful login and WebSocket connection setup

      const sendMessage = (stompClient) => {
        const message = "Your Name"; // Customize your message or get it from user input
        stompClient.send("/app/user", {}, message);
        navigate("/game");
      };
    } catch (error) {
      alert(`Something went wrong during the login: \n${handleError(error)}`);
    }
  };

  // You might want to include WebSocket cleanup logic here if you store the stompClient in a state

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
            label="Name"
            value={name}
            onChange={setName}
          />
          <div className="login button-container">
            <Button
              disabled={!username || !name}
              width="100%"
              onClick={doLogin}
            >
              Login
            </Button>
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

export default Login;
