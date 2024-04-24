import React from "react";
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Login from "../../views/Login";
import Register from "../../views/Register";
import UserProfile from "../../views/UserProfile";
import EditProfile from "../../views/EditProfile";
import Navigation from "../../views/Navigation";
import KittyCards from "../../views/KittyCards";
import FriendList from "../../views/FriendList";
import UserList from "../../views/UserList";
import Matchmaking from "../../views/Matchmaking";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/navigation" element={<Navigation />} />
        <Route path="/friendlist" element={<FriendList />} />
        <Route path="/userlist" element={<UserList />} />
        <Route path="/users/:id" element={<UserProfile />} />
        <Route path="/edit/:current_username/:status/:creation_date/:current_birthday/:id" element={<EditProfile />} />
        <Route path="*" element={<Navigate to="/login" />} />
        <Route path="/matchmaking" element={<Matchmaking />} />
        <Route path="/kittyCards/:gameId" element={<KittyCards />} />
      </Routes>
    </BrowserRouter>
  );
};


export default AppRouter;
