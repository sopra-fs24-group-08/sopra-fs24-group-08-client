import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "../../views/Login";
import Registration from "../../views/Registration";
import { useCurrUser } from "../../context/UserContext";
import Main from "../../views/Main";
import Matchmaking from "../../views/Matchmaking";
import PrivateRoute from "../routeProtectors/PrivateRoute";
import {matchPathWithParameter} from "../../../helpers/Utility";
import UserProfileEdit from "../../views/UserProfileEdit";
import UserProfile from "../../views/UserProfile";




//use PrivateRoute validate to check if paths always match up with currUser.id whenever it's needed
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/main" element={
          <PrivateRoute>
            <Main />
          </PrivateRoute>
        } />
        <Route path="/profiles/:id" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
        <Route path="/profiles/:id/edit" element={<PrivateRoute><UserProfileEdit /></PrivateRoute>} />
        <Route path="/matchmaking/queueing/:userId/:timestamp" element={
          <PrivateRoute validate={(user, location) => matchPathWithParameter(user, location, 3)}>
            <Matchmaking />
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
};


export default AppRouter;
