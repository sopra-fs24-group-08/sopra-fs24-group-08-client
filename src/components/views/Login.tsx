import React, { useState } from "react";
import { useCurrUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import "../../styles/views/Login.scss";



function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useCurrUser();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate("/main");
    } catch (error){}
  };

  const handleRegister = () => {
    navigate("/registration"); // Update this with your registration route if different
  };

  return (
    <div className="login container">
      <h2>Welcome to KittyCards</h2>
      <form onSubmit={handleSubmit} className="login form">
        <div className="login field">
          <label className="login label">Username:
            <input className="login input" type="username" value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter your username" />
          </label>
        </div>
        <div className="login field">
          <label className="login label">Password:
            <input className="login input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" />
          </label>
        </div>
        <div className="login button-container">
          <button type="submit">Login</button>
          <button type="button" onClick={handleRegister} className="register-button">Sign Up</button>
        </div>
      </form>
    </div>
  );
}


export default Login;
