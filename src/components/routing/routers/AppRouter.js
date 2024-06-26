import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../../views/Login";
import Registration from "../../views/Registration";
import Main from "../../views/Main";
import Matchmaking from "../../views/Matchmaking";
import PrivateRoute from "../routeProtectors/PrivateRoute";
import { matchPathWithParameter } from "../../../helpers/Utility";
import UserProfileEdit from "../../views/UserProfileEdit";
import UserProfile from "../../views/UserProfile";
import { DataProvider } from "../../context/DataContext";
import FriendList from "../../views/FriendList";
import UserList from "../../views/UserList";
import KittyCards from "../../views/KittyCards";
import Tutorial from "../../views/Tutorial";
import UserAchievements from "../../views/UserAchievements";
import Winner from "../../views/Winner";
import { GameProvider } from "../../context/GameContext";
import GlobalGameListener from "../../../helpers/GlobalGameListener";


//use PrivateRoute validate to check if paths always match up with currUser.id whenever it's needed
const AppRouter = () => {
  return (
    <DataProvider>
      <BrowserRouter>
        <GlobalGameListener/>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/main" element={<PrivateRoute><Main /></PrivateRoute>} />
          <Route path="/tutorial" element={<PrivateRoute><Tutorial /></PrivateRoute>} />

          <Route path="/profiles/:id" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
          <Route path="/userlist/:id" element={
            <PrivateRoute validate={(user, location) => matchPathWithParameter(user, location, 2)}>
              <UserList />
            </PrivateRoute>
          } />
          <Route path="/friendlist/:id" element={
            <PrivateRoute validate={(user, location) => matchPathWithParameter(user, location, 2)}>
              <FriendList />
            </PrivateRoute>
          } />
          <Route path="/profiles/:id/edit" element={
            <PrivateRoute validate={(user, location) => matchPathWithParameter(user, location, 2)}>
              <UserProfileEdit />
            </PrivateRoute>
          } />
          <Route path="/profiles/:id/achievements" element={
            <PrivateRoute validate={(user, location) => matchPathWithParameter(user, location, 2)}>
              <UserAchievements />
            </PrivateRoute>
          } />
          <Route path="/matchmaking/queue/:userId" element={
            <PrivateRoute validate={(user, location) => matchPathWithParameter(user, location, 3)}>
              <Matchmaking />
            </PrivateRoute>
          } />
          <Route
            path="/kittycards/:gameId"
            element={<PrivateRoute><GameProvider><KittyCards /></GameProvider></PrivateRoute>}
          />
          <Route
            path="/kittycards/:gameId/result"
            element={<PrivateRoute><Winner /></PrivateRoute>}
          />
          {/*   Improve routing later for KittyCards and Winner Page <Route path="/kittycards/:userId/:gameId" element={ //Will need to adapt the guard
          <PrivateRoute validate={(user, location) => matchPathWithParameter(user, location, 2)}>
            <KittyCards />
          </PrivateRoute>
        } />
*/} <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path={"/*"} element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </DataProvider>
  );
};


export default AppRouter;
