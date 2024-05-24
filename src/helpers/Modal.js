import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";


const Modal = ({ children, isOpen, onClose }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div style={styles.overlayStyles}>
      <div style={styles.modalStyles}>
        <div style={{height: "20px"}}></div>
        {children}
        <button onClick={onClose} style={styles.buttonStyles}>x</button>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

const styles = {
  overlayStyles: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalStyles: {
    padding: 20,
    background: "#e6e6fa",
    borderRadius: 5,
    maxWidth: "500px",
    minHeight: "200px",
    margin: "0 auto",
    position: "relative",
  },
  buttonStyles: {
    position: "absolute",
    top: 20,
    right: 20,
    padding: "2px 8px",
    fontSize: "14px",
  }
};

Modal.propTypes = {
  children: PropTypes.node,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default Modal;