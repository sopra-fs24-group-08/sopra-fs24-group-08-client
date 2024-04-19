import React from "react";
import {BrowserRouter, Navigate, Route, Routes, Redirect} from "react-router-dom";
import {GameGuard} from "../routeProtectors/GameGuard";
import {LoginGuard} from "../routeProtectors/LoginGuard";
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

        <Route path="/login" element={<LoginGuard />}>
          <Route path="/login" element={<Login/>} />
        </Route>

        <Route>
          <Route path="/register" element={<Register />} />
        </Route>

        <Route path="/navigation" element={<GameGuard />}>
          <Route path="/navigation" element={<Navigation />} />
        </Route>

        <Route path="/kittycards" element={<GameGuard />}>
          <Route path="/kittycards" element={<KittyCards />} />
        </Route>

        <Route path="/friendlist" element={<GameGuard />}>
          <Route path="/friendlist" element={<FriendList />} />
        </Route>
      
        <Route path="/userlist" element={<GameGuard />}>
          <Route path="/userlist" element={<UserList />} />
        </Route>

        <Route path="/users/:id" element={<GameGuard />}>
          <Route path="/users/:id" element={<UserProfile/>} />
        </Route>

        <Route>
          <Route exact path="/edit/:current_username/:status/:creation_date/:current_birthday/:id" element={<EditProfile/>} />
        </Route>

        <Route path="/" element={
          <Navigate to="/login" replace />
        }/>

        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>
    </BrowserRouter>
  );
};

/*
* Don't forget to export your component!
 */
export default AppRouter;
