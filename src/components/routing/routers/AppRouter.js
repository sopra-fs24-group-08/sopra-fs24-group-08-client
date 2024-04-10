import React from "react";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {GameGuard} from "../routeProtectors/GameGuard";
import GameRouter from "./GameRouter";
import {LoginGuard} from "../routeProtectors/LoginGuard";
import Login from "../../views/Login";
import Registration from "../../views/Registration";
import Profiles from "../../views/Profiles";
import Profile from "../../views/Profile";
import { RegistrationGuard } from "../routeProtectors/RegistrationGuard";
import UserEdit from "../../views/UserEdit";
import ProfilesGuard from "../routeProtectors/ProfilesGuard";
import FriendsList from "../../views/FriendsList";

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

        <Route path="/game/*" element={<GameGuard />}>
          <Route path="/game/*" element={<GameRouter base="/game"/>} />
        </Route>

        <Route path="/login" element={<LoginGuard />}>
          <Route path="/login" element={<Login/>} />
        </Route>

        <Route path="/registration" element={<RegistrationGuard />}>
          <Route path="/registration" element={<Registration/>} />
        </Route>

        <Route path="/profiles" element={<ProfilesGuard/>}>
          <Route path="/profiles" element={<Profiles/>} />
          <Route path="/profiles/*" element={<Profile/>} />
        </Route>


        <Route path="/profile/edit" element={<UserEdit/>}/>

        <Route path="/friendslist/:id" element={<FriendsList/>}/>

        
        <Route path="/" element={
          <Navigate to="/game" replace />
        }/>

      </Routes>
    </BrowserRouter>
  );
};

/*/
* Don't forget to export your component!
 */
export default AppRouter;
