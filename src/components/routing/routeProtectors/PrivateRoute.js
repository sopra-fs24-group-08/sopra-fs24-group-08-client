import { useCurrUser } from "../../context/UserContext";
import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import React from 'react';

const PrivateRoute = ({ children, validate }) => {
  const { currUser } = useCurrUser();
  const location = useLocation();

  const isValid = currUser && validate ? validate(currUser, location) : true;

  return isValid ? children : <Navigate to="/login" />;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
  validate: PropTypes.func
};

export default PrivateRoute;
