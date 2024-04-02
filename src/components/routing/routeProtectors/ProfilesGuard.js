
import React from "react";
import {Navigate, Outlet} from "react-router-dom";
import PropTypes from "prop-types";

export const ProfilesGuard = () => {
  if (localStorage.getItem("currUser") ) {
    return <Outlet />;
  }
  //Assumption Game isn't needed for M1?

  return <Navigate to="/login" replace />;
};

ProfilesGuard.propTypes = {
  children: PropTypes.node
};

export default ProfilesGuard;