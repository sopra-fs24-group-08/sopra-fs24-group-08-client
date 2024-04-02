import React from "react";
import Header from "./components/views/Header";
import AppRouter from "./components/routing/routers/AppRouter";

/**
 * Happy coding!
 * React Template by Lucas Pelloni
 * Overhauled by Kyrill Hux
 * Updated by Marco Leder
 * TA Sven, said testing only endpoints enough, leaving in extra methods that
 * either don't have an impact or are more of a bonus is ok.
 */
const App = () => {
  return (
    <div>
      <Header height="100" />
      <AppRouter />
    </div>
  );
};

export default App;

