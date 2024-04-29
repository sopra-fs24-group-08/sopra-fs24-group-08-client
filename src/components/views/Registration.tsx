import React, { useState } from "react";
import User from "models/User";
import {useNavigate} from "react-router-dom";
import { Button } from "components/ui/Button";
import "styles/views/Register.scss";
import BaseContainer from "components/ui/BaseContainer";
import { useCurrUser } from "../context/UserContext";

function Registration() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { register } = useCurrUser();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(username, password);
      navigate('/Main');
    } catch (error){
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Username:
        <input type="username" value={username} onChange={e => setUsername(e.target.value)} />
      </label>
      <label>Password:
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      </label>
      <button type="submit">Register</button>
    </form>
  );
}

export default Registration;