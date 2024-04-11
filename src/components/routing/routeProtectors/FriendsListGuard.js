import React from "react";
import {Navigate, Outlet} from "react-router-dom";
import PropTypes from "prop-types";

export const FriendsListGuard = () => {
  if (localStorage.getItem("currUser") ) {
    return <Outlet />;
  }
  return <Navigate to="/login" replace />;
};
//add specific cards now bcs currently not protected, will do later.
FriendsListGuard.propTypes = {
  children: PropTypes.node
};

export default FriendsListGuard;