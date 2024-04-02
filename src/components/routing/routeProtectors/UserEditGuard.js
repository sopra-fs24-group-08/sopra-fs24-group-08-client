
import React from "react";
import {Navigate, Outlet} from "react-router-dom";
import PropTypes from "prop-types";

//Idea would be to add more security later on for stuff that can actually affect server
export const ProfileGuard = () => {
  if (localStorage.getItem("currUser")) {

    return <Outlet />;
  }
  //Assumption Game isn't needed for M1?
  return <Navigate to="/login" replace />;
};

ProfileGuard.propTypes = {
  children: PropTypes.node
}


export default ProfileGuard;