import React from "react";
import "../styles/glitch.css";

const Loading: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div data-glitch="Loading..." className="glitch">
        Loading...
      </div>
    </div>
  );
};

export default Loading;
