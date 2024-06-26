import React from "react";
import PropTypes from "prop-types";
import "../../styles/views/Header.scss";
import KittyCards from "../../images/Kittycards.png";


/**
 * This is an example of a Functional and stateless component (View) in React. Functional components are not classes and thus don't handle internal state changes.
 * Conceptually, components are like JavaScript functions. They accept arbitrary inputs (called “props”) and return React elements describing what should appear on the screen.
 * They are reusable pieces, and think about each piece in isolation.
 * Functional com ponents have to return always something. However, they don't need a "render()" method.
 * https://react.dev/ learn/your-first-component and https://react.dev/learn/passing-props-to-a-component
 * @FunctionalComponent
 */
const Header = props => (
  <div className="header container" style={{height: props.height}}>
    <img
      src={KittyCards}
      style={{
        display: "block",
        width: "30%",
        height: "auto",
        margin: "0 auto"
      }}
      alt=""
    />
    <h1 className="header title">Kitty Cards</h1>

  </div>
);

Header.propTypes = {
  height: PropTypes.string,
};

/**
 * Don't forget to export your component!
 */
export default Header;
