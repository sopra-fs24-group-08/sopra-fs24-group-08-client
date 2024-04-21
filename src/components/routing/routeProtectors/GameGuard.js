import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const GameGuard = () => {
  const { auth } = useAuth();

  if (auth.token) {
    return <Outlet />;
  }

  return <Navigate to="/login" replace />;
};
