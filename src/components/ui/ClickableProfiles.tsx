import React from "react";
import "../../styles/ui/ClickableProfiles.scss";


export const ClickableContainer = () => {
    const handleClick = () => {
        console.log('Container was clicked!');
    };

    return (
      <div className="clickable-container" onClick={handleClick}>
          Click Me!
      </div>
    );
};

