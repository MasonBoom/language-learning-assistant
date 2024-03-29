import React from "react";
import "../styles/glitch.css";

const Loading: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen -mt-48">
      <div data-glitch="Loading..." className="glitch">
        Loading...
      </div>
    </div>
  );
};

export default Loading;
