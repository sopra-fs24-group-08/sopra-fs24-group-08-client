import React from "react";
import AppRouter from "./components/routing/routers/AppRouter";
import {UserProvider} from "./components/context/UserContext";


/**
 * Happy coding!
 * React Template by Lucas Pelloni
 * Overhauled by Kyrill Hux
 * Updated by Marco Leder
 */
const App = () => {
  return (
    <UserProvider>
      <AppRouter />
    </UserProvider>
  );
};

export default App;
