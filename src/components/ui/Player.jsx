import React from "react";
import PropTypes from "prop-types";

const Player = ({ user }) => (
  <div className="player container">
    <div className="player username">{user.username}</div>
    <div className="player name">{user.name}</div>
    <div className="player id">id: {user.id}</div>
    <div className="player status">{user.status}</div>
    {user.currIcon && (
      <img src={user.currIcon.imageUrl} alt={user.currIcon.name} style={{ width: 50, height: 50 }} />
    )}
  </div>
);

Player.propTypes = {
  user: PropTypes.object.isRequired,
};

export default Player;
