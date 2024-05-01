import React from "react";
import PropTypes from "prop-types";

const Player = ({ user }) => {
  const getStatusStyle = (status) => {
    switch (status) {
    case 'ONLINE':
      return { color: '#28a745' }; // Green
    case 'OFFLINE':
      return { color: '#ff4757' }; // Red
    case 'PLAYING':
      return { color: '#3498db' }; // Blue
    case 'QUEUING':
      return { color: '#f1c40f' }; // Yellow
    default:
      return { color: '#95a5a6' }; // Grey for undefined, we can adapt this later since using switch is "smelly code"
    }
  };

  const statusStyle = getStatusStyle(user.status);

  return (
    <div className="player container">
      <div className="player username">{user.username}</div>
      <div className="player name">{user.name}</div>
      <div className="player id">id: {user.id}</div>
      <div className="player info status" style={statusStyle}>
        {user.status}
      </div>
      {user.currIcon && (
        <img src={user.currIcon.imageUrl} alt={user.currIcon.name} style={{ width: 50, height: 50 }} />
      )}
    </div>
  );
};

Player.propTypes = {
  user: PropTypes.object.isRequired,
};

export default Player;
