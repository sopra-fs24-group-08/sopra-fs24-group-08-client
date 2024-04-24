import React from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

const ToastRequest = ({ message, onAccept, onDecline, toastId }) => (
  <div>
    <p>{message}</p>
    <button onClick={() => { onAccept(); toast.dismiss(toastId); }}>Accept</button>
    <button onClick={() => { onDecline(); toast.dismiss(toastId); }}>Decline</button>
  </div>
);

ToastRequest.propTypes = {
  message: PropTypes.string.isRequired,    // message must be a string and is required
  onAccept: PropTypes.func.isRequired,     // onAccept must be a function and is required
  onDecline: PropTypes.func.isRequired,    // onDecline must be a function and is required
  toastId: PropTypes.string.isRequired     // toastId must be a string and is required
};

export default ToastRequest;