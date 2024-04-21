import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GameGuard } from "../routeProtectors/GameGuard";
import { LoginGuard } from "../routeProtectors/LoginGuard";
import Login from "../../views/Login";
import Register from "../../views/Register";
import UserProfile from "../../views/UserProfile";
import EditProfile from "../../views/EditProfile";
import Navigation from "../../views/Navigation";
import KittyCards from "../../views/KittyCards";
import FriendList from "../../views/FriendList";
import UserList from "../../views/UserList";

/**
 * Main router of your application.
 * In the following class, different routes are rendered. In our case, there is a Login Route with matches the path "/login"
 * and another Router that matches the route "/game".
 * The main difference between these two routes is the following:
 * /login renders another component without any sub-route
 * /game renders a Router that contains other sub-routes that render in turn other react components
 * Documentation about routing in React: https://reactrouter.com/en/main/start/tutorial
 */

const AppRouter = () => {
  return (
      <BrowserRouter>
        <Routes>
          <Route element={<LoginGuard />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route element={<GameGuard />}>
            <Route path="/navigation" element={<Navigation />} />
            <Route path="/kittycards" element={<KittyCards />} />
            <Route path="/friendlist" element={<FriendList />} />
            <Route path="/userlist" element={<UserList />} />
            <Route path="/users/:id" element={<UserProfile />} />
            <Route path="/edit/:current_username/:status/:creation_date/:current_birthday/:id" element={<EditProfile />} />
          </Route>

          <Route path="/" element={<Navigate replace to="/login" />} />

          <Route path="*" element={<Navigate replace to="/login" />} />
        </Routes>
      </BrowserRouter>
  );
};

/*
* Don't forget to export your component!
 */
export default AppRouter;
