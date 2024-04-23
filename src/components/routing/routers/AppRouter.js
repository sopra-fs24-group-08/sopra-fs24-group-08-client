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
import { LoginGuard } from "../routeProtectors/LoginGuard";
import { GameGuard } from "../routeProtectors/GameGuard";

const AppRouter = () => {
  return (
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/navigation" element={<Navigation />} />
        <Route path="/kittycards" element={<KittyCards />} />
        <Route path="/friendlist" element={<FriendList />} />
        <Route path="/userlist" element={<UserList />} />
        <Route path="/users/:id" element={<UserProfile />} />
        <Route path="/edit/:current_username/:status/:creation_date/:current_birthday/:id" element={<EditProfile />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
  );
};


export default AppRouter;
